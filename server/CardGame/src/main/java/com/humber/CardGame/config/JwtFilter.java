package com.humber.CardGame.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil; //utility for JWT op
    private final UserDetailsService userDetailsService; //Service to load user detail

    public JwtFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        try {
            //get authorization header
            String authHeader = request.getHeader("Authorization");

            //check if header existed & start with Bearer
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                //remove Bearer from header
                String token = authHeader.substring(7);

                //check token validation
                if (jwtUtil.validateToken(token)) {
                    //get username
                    String username = jwtUtil.extractUsername(token);

                    //check if username existed & no existing authentication in context
                    if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                        //get user details from db
                        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                        //additional validation to check if token belong to this user
                        if (jwtUtil.isValidToken(token, username)) {
                            //create token with user details and authorities
                            UsernamePasswordAuthenticationToken authentication =
                                    new UsernamePasswordAuthenticationToken(
                                            userDetails,
                                            null,
                                            userDetails.getAuthorities()); //get user role

                            // set additional request details in authentication
                            authentication.setDetails(
                                    new WebAuthenticationDetailsSource().buildDetails(request));

                            //set the authentication in Spring Security Context
                            SecurityContextHolder.getContext().setAuthentication(authentication);
                        }
                    }
                }
            }
        } catch (Exception e) {
            //clear context if any authentication fail
            SecurityContextHolder.clearContext();
            //return 401 unauthorized response
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid authentication");
            return;
        }

        filterChain.doFilter(request, response);
    }
}