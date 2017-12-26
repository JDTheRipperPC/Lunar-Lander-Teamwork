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
import model.exceptions.IllegalOrphanException;
import model.exceptions.NonexistentEntityException;

/**
 *
 * @author admin
 */
public class ConfigurationJpaController implements Serializable {

    public ConfigurationJpaController(EntityManagerFactory emf) {
        this.emf = emf;
    }
    private EntityManagerFactory emf = null;

    public EntityManager getEntityManager() {
        return emf.createEntityManager();
    }

    public void create(Configuration configuration) {
        if (configuration.getScoreList() == null) {
            configuration.setScoreList(new ArrayList<Score>());
        }
        EntityManager em = null;
        try {
            em = getEntityManager();
            em.getTransaction().begin();
            User userId = configuration.getUserId();
            if (userId != null) {
                userId = em.getReference(userId.getClass(), userId.getId());
                configuration.setUserId(userId);
            }
            List<Score> attachedScoreList = new ArrayList<Score>();
            for (Score scoreListScoreToAttach : configuration.getScoreList()) {
                scoreListScoreToAttach = em.getReference(scoreListScoreToAttach.getClass(), scoreListScoreToAttach.getId());
                attachedScoreList.add(scoreListScoreToAttach);
            }
            configuration.setScoreList(attachedScoreList);
            em.persist(configuration);
            if (userId != null) {
                userId.getConfigurationList().add(configuration);
                userId = em.merge(userId);
            }
            for (Score scoreListScore : configuration.getScoreList()) {
                Configuration oldConfIdOfScoreListScore = scoreListScore.getConfId();
                scoreListScore.setConfId(configuration);
                scoreListScore = em.merge(scoreListScore);
                if (oldConfIdOfScoreListScore != null) {
                    oldConfIdOfScoreListScore.getScoreList().remove(scoreListScore);
                    oldConfIdOfScoreListScore = em.merge(oldConfIdOfScoreListScore);
                }
            }
            em.getTransaction().commit();
        } finally {
            if (em != null) {
                em.close();
            }
        }
    }

    public void edit(Configuration configuration) throws IllegalOrphanException, NonexistentEntityException, Exception {
        EntityManager em = null;
        try {
            em = getEntityManager();
            em.getTransaction().begin();
            Configuration persistentConfiguration = em.find(Configuration.class, configuration.getId());
            User userIdOld = persistentConfiguration.getUserId();
            User userIdNew = configuration.getUserId();
            List<Score> scoreListOld = persistentConfiguration.getScoreList();
            List<Score> scoreListNew = configuration.getScoreList();
            List<String> illegalOrphanMessages = null;
            for (Score scoreListOldScore : scoreListOld) {
                if (!scoreListNew.contains(scoreListOldScore)) {
                    if (illegalOrphanMessages == null) {
                        illegalOrphanMessages = new ArrayList<String>();
                    }
                    illegalOrphanMessages.add("You must retain Score " + scoreListOldScore + " since its confId field is not nullable.");
                }
            }
            if (illegalOrphanMessages != null) {
                throw new IllegalOrphanException(illegalOrphanMessages);
            }
            if (userIdNew != null) {
                userIdNew = em.getReference(userIdNew.getClass(), userIdNew.getId());
                configuration.setUserId(userIdNew);
            }
            List<Score> attachedScoreListNew = new ArrayList<Score>();
            for (Score scoreListNewScoreToAttach : scoreListNew) {
                scoreListNewScoreToAttach = em.getReference(scoreListNewScoreToAttach.getClass(), scoreListNewScoreToAttach.getId());
                attachedScoreListNew.add(scoreListNewScoreToAttach);
            }
            scoreListNew = attachedScoreListNew;
            configuration.setScoreList(scoreListNew);
            configuration = em.merge(configuration);
            if (userIdOld != null && !userIdOld.equals(userIdNew)) {
                userIdOld.getConfigurationList().remove(configuration);
                userIdOld = em.merge(userIdOld);
            }
            if (userIdNew != null && !userIdNew.equals(userIdOld)) {
                userIdNew.getConfigurationList().add(configuration);
                userIdNew = em.merge(userIdNew);
            }
            for (Score scoreListNewScore : scoreListNew) {
                if (!scoreListOld.contains(scoreListNewScore)) {
                    Configuration oldConfIdOfScoreListNewScore = scoreListNewScore.getConfId();
                    scoreListNewScore.setConfId(configuration);
                    scoreListNewScore = em.merge(scoreListNewScore);
                    if (oldConfIdOfScoreListNewScore != null && !oldConfIdOfScoreListNewScore.equals(configuration)) {
                        oldConfIdOfScoreListNewScore.getScoreList().remove(scoreListNewScore);
                        oldConfIdOfScoreListNewScore = em.merge(oldConfIdOfScoreListNewScore);
                    }
                }
            }
            em.getTransaction().commit();
        } catch (Exception ex) {
            String msg = ex.getLocalizedMessage();
            if (msg == null || msg.length() == 0) {
                Integer id = configuration.getId();
                if (findConfiguration(id) == null) {
                    throw new NonexistentEntityException("The configuration with id " + id + " no longer exists.");
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
            Configuration configuration;
            try {
                configuration = em.getReference(Configuration.class, id);
                configuration.getId();
            } catch (EntityNotFoundException enfe) {
                throw new NonexistentEntityException("The configuration with id " + id + " no longer exists.", enfe);
            }
            List<String> illegalOrphanMessages = null;
            List<Score> scoreListOrphanCheck = configuration.getScoreList();
            for (Score scoreListOrphanCheckScore : scoreListOrphanCheck) {
                if (illegalOrphanMessages == null) {
                    illegalOrphanMessages = new ArrayList<String>();
                }
                illegalOrphanMessages.add("This Configuration (" + configuration + ") cannot be destroyed since the Score " + scoreListOrphanCheckScore + " in its scoreList field has a non-nullable confId field.");
            }
            if (illegalOrphanMessages != null) {
                throw new IllegalOrphanException(illegalOrphanMessages);
            }
            User userId = configuration.getUserId();
            if (userId != null) {
                userId.getConfigurationList().remove(configuration);
                userId = em.merge(userId);
            }
            em.remove(configuration);
            em.getTransaction().commit();
        } finally {
            if (em != null) {
                em.close();
            }
        }
    }

    public List<Configuration> findConfigurationEntities() {
        return findConfigurationEntities(true, -1, -1);
    }

    public List<Configuration> findConfigurationEntities(int maxResults, int firstResult) {
        return findConfigurationEntities(false, maxResults, firstResult);
    }

    private List<Configuration> findConfigurationEntities(boolean all, int maxResults, int firstResult) {
        EntityManager em = getEntityManager();
        try {
            CriteriaQuery cq = em.getCriteriaBuilder().createQuery();
            cq.select(cq.from(Configuration.class));
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

    public Configuration findConfiguration(Integer id) {
        EntityManager em = getEntityManager();
        try {
            return em.find(Configuration.class, id);
        } finally {
            em.close();
        }
    }

    /**
     * Check if the configname exists in user the database.
     *
     * @param configname
     * @param user
     * @return If the user does not exist it returns false otherwise true.
     */
    public Boolean existByConfigName(String configname, User user) {
        EntityManager em = getEntityManager();
        try {
            List<User> list = em.createNamedQuery("Configuration.findByConfignameAndUserId").setParameter("configname", configname).setParameter("userId", user).getResultList();
            return !list.isEmpty();

        } finally {
            em.close();
        }
    }

    /**
     * Remove all Scores in a Configuration.
     *
     * @param conf
     */
    public void destroyScoresInConfiguration(Configuration conf) {
        EntityManager em = getEntityManager();
        try {
            em.getTransaction().begin();
            Query query = em.createQuery("DELETE FROM Score c WHERE c.confId =:confId");
            query.setParameter("confId", conf).executeUpdate();
            em.getTransaction().commit();
        } finally {
            em.close();
        }
    }

    public int getConfigurationCount() {
        EntityManager em = getEntityManager();
        try {
            CriteriaQuery cq = em.getCriteriaBuilder().createQuery();
            Root<Configuration> rt = cq.from(Configuration.class);
            cq.select(em.getCriteriaBuilder().count(rt));
            Query q = em.createQuery(cq);
            return ((Long) q.getSingleResult()).intValue();
        } finally {
            em.close();
        }
    }

}
