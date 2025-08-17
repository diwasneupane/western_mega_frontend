// services/apiService.js
import axios from "axios";

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.REACT_APP_API_URL || "http://localhost:3000/api",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        if (error.response?.status === 401) {
          this.removeToken();
          window.location.href = "/login";
        }
        return Promise.reject(error.response?.data || error.message);
      }
    );

    // Initialize API sections
    this.auth = {
      login: (identifier, password) =>
        this.post("/auth/login", { identifier, password }),
      getProfile: () => this.get("/auth/me"),
      updatePassword: (currentPassword, newPassword) =>
        this.put("/auth/update-password", { currentPassword, newPassword }),
    };

    this.courses = {
      getAll: (params = {}) => this.get("/courses", params),
      getById: (id) => this.get(`/courses/${id}`),
      getEnrolled: (userId, params = {}) =>
        this.get(`/courses/student/${userId}/enrolled`, params),
      getByTeacher: (teacherId) => this.get(`/courses/teacher/${teacherId}`),
    };

    this.profiles = {
      getById: (userId) => this.get(`/profiles/${userId}`),
      update: (userId, data) => this.put(`/profiles/${userId}`, data),
      uploadAvatar: (userId, file) => {
        const formData = new FormData();
        formData.append("avatar", file);
        return this.post(`/profiles/${userId}/avatar`, formData, {
          "Content-Type": "multipart/form-data",
        });
      },
      uploadDocument: (userId, file, name, description) => {
        const formData = new FormData();
        formData.append("document", file);
        formData.append("name", name);
        formData.append("description", description);
        return this.post(`/profiles/${userId}/documents`, formData, {
          "Content-Type": "multipart/form-data",
        });
      },
    };

    this.results = {
      getByStudent: (userId, params = {}) =>
        this.get(`/results/student/${userId}`, params),
      getById: (resultId) => this.get(`/results/${resultId}`),
      getGPA: (userId, params = {}) =>
        this.get(`/results/student/${userId}/gpa`, params),
    };

    this.users = {
      getByRole: (role) => this.get(`/users/role/${role}`),
    };
  }

  // Token management
  getToken() {
    return localStorage.getItem("token");
  }

  setToken(token) {
    localStorage.setItem("token", token);
  }

  removeToken() {
    localStorage.removeItem("token");
  }

  // HTTP Methods
  async get(url, params = {}) {
    return await this.api.get(url, { params });
  }

  async post(url, data = {}, headers = {}) {
    return await this.api.post(url, data, { headers });
  }

  async put(url, data = {}) {
    return await this.api.put(url, data);
  }

  async patch(url, data = {}) {
    return await this.api.patch(url, data);
  }

  async delete(url) {
    return await this.api.delete(url);
  }

  // Legacy methods (keeping for backward compatibility)
  async login(identifier, password) {
    return this.auth.login(identifier, password);
  }

  async getProfile() {
    return this.auth.getProfile();
  }

  async updateProfile(data) {
    return this.put("/users/profile", data);
  }

  async uploadProfilePicture(file) {
    const formData = new FormData();
    formData.append("profilePicture", file);
    return this.post("/users/upload-profile-picture", formData, {
      "Content-Type": "multipart/form-data",
    });
  }

  // Student APIs
  async getStudentDashboard() {
    return this.get("/students/dashboard");
  }

  async getStudentCourses() {
    return this.get("/students/courses");
  }

  async getStudentResults() {
    return this.get("/students/results");
  }

  async getCourseDetails(courseId) {
    return this.get(`/courses/${courseId}`);
  }

  async getAssignments(courseId) {
    return this.get(`/courses/${courseId}/assignments`);
  }

  async submitAssignment(assignmentId, data) {
    return this.post(`/assignments/${assignmentId}/submit`, data);
  }

  // Public APIs
  async getPublicCourses() {
    return this.get("/courses/public");
  }

  async getBlogPosts() {
    return this.get("/blog");
  }

  async getBlogPost(id) {
    return this.get(`/blog/${id}`);
  }

  async getAboutInfo() {
    return this.get("/about");
  }

  // Utility methods
  async uploadFile(file, type = "general") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    return this.post("/upload", formData, {
      "Content-Type": "multipart/form-data",
    });
  }

  // Handle network errors
  isNetworkError(error) {
    return !error.response && error.request;
  }

  getErrorMessage(error) {
    if (this.isNetworkError(error)) {
      return "Network error. Please check your connection.";
    }
    return error.message || "An unexpected error occurred.";
  }
}

const apiService = new ApiService();
export default apiService;
