package com.tiduswr.movies_server.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tb_status")
@Getter @Setter 
@NoArgsConstructor @AllArgsConstructor 
@Builder 
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Status {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    @Column(name = "status_id")
    private Long statusId;

    private String name;

    public enum Values{
        OK(1l),
        ERROR(2l),
        PROCESSING(3l);

        public final long statusId;

        Values(long id){
            statusId = id;
        }
    }

}
