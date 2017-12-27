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
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;
import javax.persistence.EntityNotFoundException;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import model.exceptions.NonexistentEntityException;

/**
 *
 * @author admin
 */
public class ScoreJpaController implements Serializable {

    public ScoreJpaController(EntityManagerFactory emf) {
        this.emf = emf;
    }
    private EntityManagerFactory emf = null;

    public EntityManager getEntityManager() {
        return emf.createEntityManager();
    }

    public void create(Score score) {
        EntityManager em = null;
        try {
            em = getEntityManager();
            em.getTransaction().begin();
            Configuration confId = score.getConfId();
            if (confId != null) {
                confId = em.getReference(confId.getClass(), confId.getId());
                score.setConfId(confId);
            }
            em.persist(score);
            if (confId != null) {
                confId.getScoreList().add(score);
                confId = em.merge(confId);
            }
            em.getTransaction().commit();
        } finally {
            if (em != null) {
                em.close();
            }
        }
    }

    public void edit(Score score) throws NonexistentEntityException, Exception {
        EntityManager em = null;
        try {
            em = getEntityManager();
            em.getTransaction().begin();
            Score persistentScore = em.find(Score.class, score.getId());
            Configuration confIdOld = persistentScore.getConfId();
            Configuration confIdNew = score.getConfId();
            if (confIdNew != null) {
                confIdNew = em.getReference(confIdNew.getClass(), confIdNew.getId());
                score.setConfId(confIdNew);
            }
            score = em.merge(score);
            if (confIdOld != null && !confIdOld.equals(confIdNew)) {
                confIdOld.getScoreList().remove(score);
                confIdOld = em.merge(confIdOld);
            }
            if (confIdNew != null && !confIdNew.equals(confIdOld)) {
                confIdNew.getScoreList().add(score);
                confIdNew = em.merge(confIdNew);
            }
            em.getTransaction().commit();
        } catch (Exception ex) {
            String msg = ex.getLocalizedMessage();
            if (msg == null || msg.length() == 0) {
                Integer id = score.getId();
                if (findScore(id) == null) {
                    throw new NonexistentEntityException("The score with id " + id + " no longer exists.");
                }
            }
            throw ex;
        } finally {
            if (em != null) {
                em.close();
            }
        }
    }

    public void destroy(Integer id) throws NonexistentEntityException {
        EntityManager em = null;
        try {
            em = getEntityManager();
            em.getTransaction().begin();
            Score score;
            try {
                score = em.getReference(Score.class, id);
                score.getId();
            } catch (EntityNotFoundException enfe) {
                throw new NonexistentEntityException("The score with id " + id + " no longer exists.", enfe);
            }
            Configuration confId = score.getConfId();
            if (confId != null) {
                confId.getScoreList().remove(score);
                confId = em.merge(confId);
            }
            em.remove(score);
            em.getTransaction().commit();
        } finally {
            if (em != null) {
                em.close();
            }
        }
    }

    public List<Score> findScoreEntities() {
        return findScoreEntities(true, -1, -1);
    }

    public List<Score> findScoreEntities(int maxResults, int firstResult) {
        return findScoreEntities(false, maxResults, firstResult);
    }

    private List<Score> findScoreEntities(boolean all, int maxResults, int firstResult) {
        EntityManager em = getEntityManager();
        try {
            CriteriaQuery cq = em.getCriteriaBuilder().createQuery();
            cq.select(cq.from(Score.class));
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

    public Score findScore(Integer id) {
        EntityManager em = getEntityManager();
        try {
            return em.find(Score.class, id);
        } finally {
            em.close();
        }
    }

    /**
     * If that user has unfinished games, they are eliminated.
     *
     * @param user
     */
    public void destroyScoresUserEmpty(User user) {
        EntityManager em = getEntityManager();
        try {
            for (Configuration conf : user.getConfigurationList()) {
                em.getTransaction().begin();
                Query query = em.createQuery("DELETE FROM Score c WHERE c.endtime IS NULL AND c.confId=:confId");
                query.setParameter("confId", conf).executeUpdate();
                em.getTransaction().commit();
            }
        } finally {
            em.close();
        }

    }

    /**
     * Get all the scores finished by a user.
     * @param user
     * @return List with all the scores.
     */
    public List<Score> getScoresUser(User user) {
        EntityManager em = getEntityManager();
        try {
            List<Score> scores = new ArrayList<>();
            for (Configuration conf : user.getConfigurationList()) {
                Query query = em.createQuery("Select c FROM Score c WHERE c.endtime IS NOT NULL AND c.confId=:confId");
                scores.addAll(query.setParameter("confId", conf).getResultList());
            }
            return scores;
        } finally {
            em.close();
        }

    }

    public int getScoreCount() {
        EntityManager em = getEntityManager();
        try {
            CriteriaQuery cq = em.getCriteriaBuilder().createQuery();
            Root<Score> rt = cq.from(Score.class);
            cq.select(em.getCriteriaBuilder().count(rt));
            Query q = em.createQuery(cq);
            return ((Long) q.getSingleResult()).intValue();
        } finally {
            em.close();
        }
    }

}
