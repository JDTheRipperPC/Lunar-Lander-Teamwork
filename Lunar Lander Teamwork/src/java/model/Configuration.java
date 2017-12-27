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

import com.google.gson.annotations.Expose;
import java.io.Serializable;
import java.util.List;
import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

/**
 *
 * @author admin
 */
@Entity
@Table(name = "public.configuration")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Configuration.findAll", query = "SELECT c FROM Configuration c")
    , @NamedQuery(name = "Configuration.findById", query = "SELECT c FROM Configuration c WHERE c.id = :id")
    , @NamedQuery(name = "Configuration.findByConfigname", query = "SELECT c FROM Configuration c WHERE c.configname = :configname")
    , @NamedQuery(name = "Configuration.findByDiffId", query = "SELECT c FROM Configuration c WHERE c.diffId = :diffId")
    , @NamedQuery(name = "Configuration.findByRocketId", query = "SELECT c FROM Configuration c WHERE c.rocketId = :rocketId")
    , @NamedQuery(name = "Configuration.findByPlanetId", query = "SELECT c FROM Configuration c WHERE c.planetId = :planetId")
    , @NamedQuery(name = "Configuration.findByConfignameAndUserId", query = "SELECT c FROM Configuration c WHERE c.configname = :configname AND c.userId = :userId")})
public class Configuration implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    @Expose
    private Integer id;
    @Basic(optional = false)
    @Column(name = "configname")
    @Expose
    private String configname;
    @Basic(optional = false)
    @Column(name = "diff_id")
    @Expose
    private int diffId;
    @Basic(optional = false)
    @Column(name = "rocket_id")
    @Expose
    private int rocketId;
    @Basic(optional = false)
    @Column(name = "planet_id")
    @Expose
    private int planetId;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "confId", fetch = FetchType.LAZY)
    @Expose (serialize = false)
    private List<Score> scoreList;
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @Expose (serialize = false)
    private User userId;

    public Configuration() {
    }

    public Configuration(Integer id) {
        this.id = id;
    }

    public Configuration(Integer id, String configname, int diffId, int rocketId, int planetId) {
        this.id = id;
        this.configname = configname;
        this.diffId = diffId;
        this.rocketId = rocketId;
        this.planetId = planetId;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getConfigname() {
        return configname;
    }

    public void setConfigname(String configname) {
        this.configname = configname;
    }

    public int getDiffId() {
        return diffId;
    }

    public void setDiffId(int diffId) {
        this.diffId = diffId;
    }

    public int getRocketId() {
        return rocketId;
    }

    public void setRocketId(int rocketId) {
        this.rocketId = rocketId;
    }

    public int getPlanetId() {
        return planetId;
    }

    public void setPlanetId(int planetId) {
        this.planetId = planetId;
    }

    @XmlTransient
    public List<Score> getScoreList() {
        return scoreList;
    }

    public void setScoreList(List<Score> scoreList) {
        this.scoreList = scoreList;
    }

    public User getUserId() {
        return userId;
    }

    public void setUserId(User userId) {
        this.userId = userId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Configuration)) {
            return false;
        }
        Configuration other = (Configuration) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "model.Configuration[ id=" + id + " ]";
    }

}
