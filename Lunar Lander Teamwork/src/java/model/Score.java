/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Basic;
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
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author admin
 */
@Entity
@Table(name = "public.score")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Score.findAll", query = "SELECT s FROM Score s")
    , @NamedQuery(name = "Score.findById", query = "SELECT s FROM Score s WHERE s.id = :id")
    , @NamedQuery(name = "Score.findBySpead", query = "SELECT s FROM Score s WHERE s.spead = :spead")
    , @NamedQuery(name = "Score.findByFuel", query = "SELECT s FROM Score s WHERE s.fuel = :fuel")
    , @NamedQuery(name = "Score.findByTrys", query = "SELECT s FROM Score s WHERE s.trys = :trys")
    , @NamedQuery(name = "Score.findByInittime", query = "SELECT s FROM Score s WHERE s.inittime = :inittime")
    , @NamedQuery(name = "Score.findByEndtime", query = "SELECT s FROM Score s WHERE s.endtime = :endtime")})
public class Score implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Basic(optional = false)
    @Column(name = "spead")
    private double spead;
    @Basic(optional = false)
    @Column(name = "fuel")
    private double fuel;
    @Basic(optional = false)
    @Column(name = "trys")
    private int trys;
    @Basic(optional = false)
    @Column(name = "inittime")
    @Temporal(TemporalType.TIMESTAMP)
    private Date inittime;
    @Basic(optional = false)
    @Column(name = "endtime")
    @Temporal(TemporalType.TIMESTAMP)
    private Date endtime;
    @JoinColumn(name = "conf_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Configuration confId;

    public Score() {
    }

    public Score(Integer id) {
        this.id = id;
    }

    public Score(Integer id, double spead, double fuel, int trys, Date inittime, Date endtime) {
        this.id = id;
        this.spead = spead;
        this.fuel = fuel;
        this.trys = trys;
        this.inittime = inittime;
        this.endtime = endtime;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public double getSpead() {
        return spead;
    }

    public void setSpead(double spead) {
        this.spead = spead;
    }

    public double getFuel() {
        return fuel;
    }

    public void setFuel(double fuel) {
        this.fuel = fuel;
    }

    public int getTrys() {
        return trys;
    }

    public void setTrys(int trys) {
        this.trys = trys;
    }

    public Date getInittime() {
        return inittime;
    }

    public void setInittime(Date inittime) {
        this.inittime = inittime;
    }

    public Date getEndtime() {
        return endtime;
    }

    public void setEndtime(Date endtime) {
        this.endtime = endtime;
    }

    public Configuration getConfId() {
        return confId;
    }

    public void setConfId(Configuration confId) {
        this.confId = confId;
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
        if (!(object instanceof Score)) {
            return false;
        }
        Score other = (Score) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "objects.Score[ id=" + id + " ]";
    }
    
}
