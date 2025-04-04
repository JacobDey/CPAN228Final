package com.humber.CardGame.repositories;

import com.humber.CardGame.models.user.MyUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<MyUser, String> {

    //get user by username
    Optional<MyUser> findByUsername(String username);

    //get user by email
    Optional<MyUser> findByEmail(String email);
}