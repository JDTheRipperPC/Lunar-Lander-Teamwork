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
@Table(name = "score")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Score.findAll", query = "SELECT s FROM Score s")
    , @NamedQuery(name = "Score.findById", query = "SELECT s FROM Score s WHERE s.id = :id")
    , @NamedQuery(name = "Score.findBySpeed", query = "SELECT s FROM Score s WHERE s.speed = :speed")
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
    @Expose
    private Integer id;
    @Column(name = "speed")
    @Expose
    private Double speed;
    @Column(name = "fuel")
    @Expose
    private Double fuel;
    @Column(name = "trys")
    @Expose (serialize = false)
    private Integer trys;
    @Column(name = "inittime", insertable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @Expose (serialize = false)
    private Date inittime;
    @Column(name = "endtime")
    @Temporal(TemporalType.TIMESTAMP)
    @Expose (serialize = false)
    private Date endtime;
    @JoinColumn(name = "conf_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @Expose 
    private Configuration confId;

    public Score() {
    }

    public Score(Integer id) {
        this.id = id;
    }

    public Score(Integer id, Date inittime) {
        this.id = id;
        this.inittime = inittime;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Double getSpeed() {
        return speed;
    }

    public void setSpeed(Double speed) {
        this.speed = speed;
    }

    public Double getFuel() {
        return fuel;
    }

    public void setFuel(Double fuel) {
        this.fuel = fuel;
    }

    public Integer getTrys() {
        return trys;
    }

    public void setTrys(Integer trys) {
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
        return "model.Score[ id=" + id + " ]";
    }

}
