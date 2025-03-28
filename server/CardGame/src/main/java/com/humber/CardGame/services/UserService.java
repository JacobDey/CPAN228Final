package com.humber.CardGame.services;


import com.humber.CardGame.config.JwtUtil;
import com.humber.CardGame.models.MyUser;
import com.humber.CardGame.repositories.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.Optional;

@Service
public class UserService {

    //injection
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.jwtUtil = jwtUtil;
    }

    //save user to db
    public void saveUser(MyUser user) {
        //check if username existed
        if(userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("username already exists");
        }
        //check if email existed
        if(userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("email already exists");
        }
        //encrypt password
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        user.setCreatedAt(new Date());
        user.setCards(new ArrayList<>()); //change to default pack
        user.setRole("USER");

        //save user
        userRepository.save(user);
    }

    //login and return jwt token
    public String login(String username, String password) {
        Optional<MyUser> userOp = userRepository.findByUsername(username);
        if(userOp.isPresent()) {
            MyUser user = userOp.get();
            if(bCryptPasswordEncoder.matches(password, user.getPassword())) {
                return jwtUtil.generateToken(user.getUsername());
            }
        }
        throw new RuntimeException("Invalid username or password");
    }
}
