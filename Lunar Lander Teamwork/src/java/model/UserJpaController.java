/*
 * The MIT License
 *
 * Copyright 2017 admin.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
package model;

import java.io.Serializable;
import javax.persistence.Query;
import javax.persistence.EntityNotFoundException;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.NoResultException;
import model.exceptions.IllegalOrphanException;
import model.exceptions.NonexistentEntityException;

/**
 *
 * @author admin
 */
public class UserJpaController implements Serializable {

    public UserJpaController(EntityManagerFactory emf) {
        this.emf = emf;
    }
    private EntityManagerFactory emf = null;

    public EntityManager getEntityManager() {
        return emf.createEntityManager();
    }

    public void create(User user) {
        if (user.getConfigurationList() == null) {
            user.setConfigurationList(new ArrayList<Configuration>());
        }
        EntityManager em = null;
        try {
            em = getEntityManager();
            em.getTransaction().begin();
            List<Configuration> attachedConfigurationList = new ArrayList<Configuration>();
            for (Configuration configurationListConfigurationToAttach : user.getConfigurationList()) {
                configurationListConfigurationToAttach = em.getReference(configurationListConfigurationToAttach.getClass(), configurationListConfigurationToAttach.getId());
                attachedConfigurationList.add(configurationListConfigurationToAttach);
            }
            user.setConfigurationList(attachedConfigurationList);
            em.persist(user);
            for (Configuration configurationListConfiguration : user.getConfigurationList()) {
                User oldUserIdOfConfigurationListConfiguration = configurationListConfiguration.getUserId();
                configurationListConfiguration.setUserId(user);
                configurationListConfiguration = em.merge(configurationListConfiguration);
                if (oldUserIdOfConfigurationListConfiguration != null) {
                    oldUserIdOfConfigurationListConfiguration.getConfigurationList().remove(configurationListConfiguration);
                    oldUserIdOfConfigurationListConfiguration = em.merge(oldUserIdOfConfigurationListConfiguration);
                }
            }
            em.getTransaction().commit();
        } finally {
            if (em != null) {
                em.close();
            }
        }
    }

    public void edit(User user) throws IllegalOrphanException, NonexistentEntityException, Exception {
        EntityManager em = null;
        try {
            em = getEntityManager();
            em.getTransaction().begin();
            User persistentUser = em.find(User.class, user.getId());
            List<Configuration> configurationListOld = persistentUser.getConfigurationList();
            List<Configuration> configurationListNew = user.getConfigurationList();
            List<String> illegalOrphanMessages = null;
            for (Configuration configurationListOldConfiguration : configurationListOld) {
                if (!configurationListNew.contains(configurationListOldConfiguration)) {
                    if (illegalOrphanMessages == null) {
                        illegalOrphanMessages = new ArrayList<String>();
                    }
                    illegalOrphanMessages.add("You must retain Configuration " + configurationListOldConfiguration + " since its userId field is not nullable.");
                }
            }
            if (illegalOrphanMessages != null) {
                throw new IllegalOrphanException(illegalOrphanMessages);
            }
            List<Configuration> attachedConfigurationListNew = new ArrayList<Configuration>();
            for (Configuration configurationListNewConfigurationToAttach : configurationListNew) {
                configurationListNewConfigurationToAttach = em.getReference(configurationListNewConfigurationToAttach.getClass(), configurationListNewConfigurationToAttach.getId());
                attachedConfigurationListNew.add(configurationListNewConfigurationToAttach);
            }
            configurationListNew = attachedConfigurationListNew;
            user.setConfigurationList(configurationListNew);
            user = em.merge(user);
            for (Configuration configurationListNewConfiguration : configurationListNew) {
                if (!configurationListOld.contains(configurationListNewConfiguration)) {
                    User oldUserIdOfConfigurationListNewConfiguration = configurationListNewConfiguration.getUserId();
                    configurationListNewConfiguration.setUserId(user);
                    configurationListNewConfiguration = em.merge(configurationListNewConfiguration);
                    if (oldUserIdOfConfigurationListNewConfiguration != null && !oldUserIdOfConfigurationListNewConfiguration.equals(user)) {
                        oldUserIdOfConfigurationListNewConfiguration.getConfigurationList().remove(configurationListNewConfiguration);
                        oldUserIdOfConfigurationListNewConfiguration = em.merge(oldUserIdOfConfigurationListNewConfiguration);
                    }
                }
            }
            em.getTransaction().commit();
        } catch (Exception ex) {
            String msg = ex.getLocalizedMessage();
            if (msg == null || msg.length() == 0) {
                Integer id = user.getId();
                if (findUser(id) == null) {
                    throw new NonexistentEntityException("The user with id " + id + " no longer exists.");
                }
            }
            throw ex;
        } finally {
            if (em != null) {
                em.close();
            }
        }
    }

    public void destroy(Integer id) throws IllegalOrphanException, NonexistentEntityException {
        EntityManager em = null;
        try {
            em = getEntityManager();
            em.getTransaction().begin();
            User user;
            try {
                user = em.getReference(User.class, id);
                user.getId();
            } catch (EntityNotFoundException enfe) {
                throw new NonexistentEntityException("The user with id " + id + " no longer exists.", enfe);
            }
            List<String> illegalOrphanMessages = null;
            List<Configuration> configurationListOrphanCheck = user.getConfigurationList();
            for (Configuration configurationListOrphanCheckConfiguration : configurationListOrphanCheck) {
                if (illegalOrphanMessages == null) {
                    illegalOrphanMessages = new ArrayList<String>();
                }
                illegalOrphanMessages.add("This User (" + user + ") cannot be destroyed since the Configuration " + configurationListOrphanCheckConfiguration + " in its configurationList field has a non-nullable userId field.");
            }
            if (illegalOrphanMessages != null) {
                throw new IllegalOrphanException(illegalOrphanMessages);
            }
            em.remove(user);
            em.getTransaction().commit();
        } finally {
            if (em != null) {
                em.close();
            }
        }
    }

    public List<User> findUserEntities() {
        return findUserEntities(true, -1, -1);
    }

    public List<User> findUserEntities(int maxResults, int firstResult) {
        return findUserEntities(false, maxResults, firstResult);
    }

    private List<User> findUserEntities(boolean all, int maxResults, int firstResult) {
        EntityManager em = getEntityManager();
        try {
            CriteriaQuery cq = em.getCriteriaBuilder().createQuery();
            cq.select(cq.from(User.class));
            Query q = em.createQuery(cq);
            if (!all) {
                q.setMaxResults(maxResults);
                q.setFirstResult(firstResult);
            }
            return q.getResultList();
        } finally {
            em.close();
        }
    }

    public User findUser(Integer id) {
        EntityManager em = getEntityManager();
        try {
            return em.find(User.class, id);
        } finally {
            em.close();
        }
    }

    /**
     * Find a user.
     *
     * @param username
     * @return Object User in case you find it, otherwise null.
     */
    public User findUserByUsername(String username) {
        EntityManager em = getEntityManager();
        try {
            return (User) em.createNamedQuery("User.findByUsername").setParameter("username", username).getSingleResult();
        } catch (NoResultException e) {
            return null;
        } finally {
            em.close();
        }
    }

    /**
     * Check if the username exists in the database.
     *
     * @param username
     * @return If the user does not exist it returns false otherwise true.
     */
    public Boolean existByUsername(String username) {
        EntityManager em = getEntityManager();
        try {
            List<User> list = em.createNamedQuery("User.findByUsername").setParameter("username", username).getResultList();
            return !list.isEmpty();

        } finally {
            em.close();
        }
    }

    /**
     * Check if the email exists in the database.
     *
     * @param email
     * @return If the user does not exist it returns false otherwise true.
     */
    public Boolean existByEmail(String email) {
        EntityManager em = getEntityManager();
        try {
            List<User> list = em.createNamedQuery("User.findByEmail").setParameter("email", email).getResultList();
            return !list.isEmpty();

        } finally {
            em.close();
        }
    }

    /**
     * Get the 10 users with the most attempts.
     *
     * @return List with username and attempts.
     */
    public List getScoresUserCount() {
        EntityManager em = getEntityManager();
        try {
            Query query = em.createQuery(
                    "select u.username, count(s.id) from User u "
                    + "left join u.configurationList p "
                    + "left join p.scoreList s "
                    + "group by u.username "
                    + "HAVING count(s.id) > 0 "
                    + "ORDER BY count(s.id) DESC");
            return query.setMaxResults(10).getResultList();

        } finally {
            em.close();
        }
    }

    public int getUserCount() {
        EntityManager em = getEntityManager();
        try {
            CriteriaQuery cq = em.getCriteriaBuilder().createQuery();
            Root<User> rt = cq.from(User.class);
            cq.select(em.getCriteriaBuilder().count(rt));
            Query q = em.createQuery(cq);
            return ((Long) q.getSingleResult()).intValue();
        } finally {
            em.close();
        }
    }

}
