/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model;

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
@Table(name = "configuration")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Configuration.findAll", query = "SELECT c FROM Configuration c")
    , @NamedQuery(name = "Configuration.findById", query = "SELECT c FROM Configuration c WHERE c.id = :id")
    , @NamedQuery(name = "Configuration.findByConfigname", query = "SELECT c FROM Configuration c WHERE c.configname = :configname")
    , @NamedQuery(name = "Configuration.findByDiffId", query = "SELECT c FROM Configuration c WHERE c.diffId = :diffId")
    , @NamedQuery(name = "Configuration.findByNaveId", query = "SELECT c FROM Configuration c WHERE c.naveId = :naveId")
    , @NamedQuery(name = "Configuration.findByPlanetId", query = "SELECT c FROM Configuration c WHERE c.planetId = :planetId")})
public class Configuration implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Basic(optional = false)
    @Column(name = "configname")
    private String configname;
    @Basic(optional = false)
    @Column(name = "diff_id")
    private int diffId;
    @Basic(optional = false)
    @Column(name = "nave_id")
    private int naveId;
    @Basic(optional = false)
    @Column(name = "planet_id")
    private int planetId;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "confId", fetch = FetchType.LAZY)
    private List<Score> scoreList;
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private User userId;

    public Configuration() {
    }

    public Configuration(Integer id) {
        this.id = id;
    }

    public Configuration(Integer id, String configname, int diffId, int naveId, int planetId) {
        this.id = id;
        this.configname = configname;
        this.diffId = diffId;
        this.naveId = naveId;
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

    public int getNaveId() {
        return naveId;
    }

    public void setNaveId(int naveId) {
        this.naveId = naveId;
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
        return "objects.Configuration[ id=" + id + " ]";
    }
    
}
