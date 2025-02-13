package com.tiduswr.movies_server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tiduswr.movies_server.entities.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long>{}
