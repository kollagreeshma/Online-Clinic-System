package com.ocs.service;

import com.ocs.dto.ApiResponse;
import com.ocs.dto.AuthRequest;
import com.ocs.dto.AuthResponse;
import com.ocs.dto.RegisterRequest;

public interface AuthService {
    AuthResponse login(AuthRequest request);
    ApiResponse registerPatient(RegisterRequest request);
}
