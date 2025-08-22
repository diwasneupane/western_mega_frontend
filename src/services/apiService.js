// services/apiService.js
import axios from "axios";

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
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
      register: (userData) => this.post("/auth/register", userData),
      getProfile: () => this.get("/auth/me"),
      updatePassword: (currentPassword, newPassword) =>
        this.put("/auth/update-password", { currentPassword, newPassword }),
      logout: () => this.post("/auth/logout"),
    };

    this.courses = {
      getAll: (params = {}) => this.get("/courses", params),
      getById: (id) => this.get(`/courses/${id}`),
      create: (courseData) => this.post("/courses", courseData),
      update: (id, courseData) => this.put(`/courses/${id}`, courseData),
      delete: (id) => this.delete(`/courses/${id}`),
      getEnrolled: (userId, params = {}) =>
        this.get(`/courses/student/${userId}/enrolled`, params),
      getByTeacher: (teacherId) => this.get(`/courses/teacher/${teacherId}`),
      enroll: (courseId, studentId) =>
        this.post(`/courses/${courseId}/enroll`, { studentId }),
      removeStudent: (courseId, studentId) =>
        this.delete(`/courses/${courseId}/students/${studentId}`),
      // Add this method for backward compatibility
      getEnrolledCourses: function (userId) {
        return this.getEnrolled(userId);
      },
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
      deleteAvatar: (userId) => this.delete(`/profiles/${userId}/avatar`),
      uploadDocument: (userId, file, name, description) => {
        const formData = new FormData();
        formData.append("document", file);
        formData.append("name", name);
        formData.append("description", description);
        return this.post(`/profiles/${userId}/documents`, formData, {
          "Content-Type": "multipart/form-data",
        });
      },
      deleteDocument: (userId, documentId) =>
        this.delete(`/profiles/${userId}/documents/${documentId}`),
    };

    this.results = {
      getAll: (params = {}) => this.get("/results", params),
      create: (resultData) => this.post("/results", resultData),
      getById: (resultId) => this.get(`/results/${resultId}`),
      update: (resultId, data) => this.put(`/results/${resultId}`, data),
      delete: (resultId) => this.delete(`/results/${resultId}`),
      getByStudent: (userId, params = {}) =>
        this.get(`/results/student/${userId}`, params),
      getByCourse: (courseId, params = {}) =>
        this.get(`/results/course/${courseId}`, params),
      getGPA: (userId, params = {}) =>
        this.get(`/results/student/${userId}/gpa`, params),
      addAssessment: (resultId, assessmentData) =>
        this.post(`/results/${resultId}/assessments`, assessmentData),
    };

    this.users = {
      getAll: (params = {}) => this.get("/users", params),
      getById: (id) => this.get(`/users/${id}`),
      update: (id, data) => this.put(`/users/${id}`, data),
      delete: (id) => this.delete(`/users/${id}`),
      getByRole: (role) => this.get(`/users/role/${role}`),
      toggleStatus: (id) => this.patch(`/users/${id}/toggle-status`),
    };

    // Cache for current user data to avoid repeated API calls
    this._currentUser = null;
    this._userCacheTime = null;
    this.CACHE_DURATION = 60000; // 1 minute cache
  }

  // Token management (only store token, never user data)
  getToken() {
    // Try localStorage first, then cookie
    let token = localStorage.getItem("token");

    if (!token) {
      const cookies = document.cookie.split(";");
      const authTokenCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("auth_token=")
      );
      if (authTokenCookie) {
        token = authTokenCookie.split("=")[1];
      }
    }

    return token;
  }

  setToken(token) {
    localStorage.setItem("token", token);
  }

  removeToken() {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Clear any old user data
    this._currentUser = null; // Clear cache
    this._userCacheTime = null;

    // Also clear cookie if it exists
    document.cookie =
      "auth_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
  }

  // Get current user from API (with caching to avoid repeated calls)
  async getCurrentUser() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Check if we have cached data that's still fresh
      const now = Date.now();
      if (
        this._currentUser &&
        this._userCacheTime &&
        now - this._userCacheTime < this.CACHE_DURATION
      ) {
        console.log("Using cached user data:", this._currentUser);
        return this._currentUser;
      }

      console.log("Fetching fresh user data from /auth/me");
      const response = await this.auth.getProfile();

      if (response.success && response.data && response.data.user) {
        this._currentUser = response.data.user;
        this._userCacheTime = now;
        console.log("✅ Fresh user data fetched:", this._currentUser);
        return this._currentUser;
      } else {
        throw new Error("Invalid user data format from API");
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      this._currentUser = null;
      this._userCacheTime = null;
      throw error;
    }
  }

  // Get current user ID from token/API
  async getCurrentUserId() {
    try {
      const user = await this.getCurrentUser();
      const userId = user._id || user.id;
      console.log("Current user ID:", userId);
      return userId;
    } catch (error) {
      console.error("Error getting current user ID:", error);
      return null;
    }
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

  // Login method - only store token
  async login(identifier, password) {
    try {
      const response = await this.auth.login(identifier, password);

      console.log("Login response:", response);

      // Only store the token, not user data
      if (response.success && response.data && response.data.token) {
        this.setToken(response.data.token);
        console.log("✅ Token stored successfully");

        // Clear any cached user data so next call fetches fresh data
        this._currentUser = null;
        this._userCacheTime = null;
      }

      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async getProfile() {
    return this.auth.getProfile();
  }

  // Updated Student APIs using token-based user fetching
  async getStudentDashboard() {
    try {
      console.log("Loading dashboard data...");
      const userId = await this.getCurrentUserId();

      if (!userId) {
        throw new Error("User not authenticated");
      }

      // Get dashboard data by combining multiple API calls
      const [courses, results, user] = await Promise.all([
        this.courses.getEnrolled(userId).catch((error) => {
          console.warn("Failed to load courses:", error);
          return { data: [] };
        }),
        this.results.getByStudent(userId).catch((error) => {
          console.warn("Failed to load results:", error);
          return { data: [] };
        }),
        this.getCurrentUser().catch((error) => {
          console.warn("Failed to get user data:", error);
          return null;
        }),
      ]);

      return {
        success: true,
        data: {
          courses: courses.data || courses || [],
          results: results.data || results || [],
          user: user,
        },
      };
    } catch (error) {
      console.error("Dashboard error:", error);
      return {
        success: false,
        error: this.getErrorMessage(error),
        data: {
          courses: [],
          results: [],
          user: null,
        },
      };
    }
  }

  async getStudentCourses() {
    try {
      console.log("Loading student courses...");
      const userId = await this.getCurrentUserId();

      if (!userId) {
        throw new Error("User not authenticated");
      }

      console.log("Fetching courses for user:", userId);
      const response = await this.courses.getEnrolled(userId);
      console.log("Courses API response:", response);

      return {
        success: true,
        data: {
          courses: response.data || response || [],
        },
      };
    } catch (error) {
      console.error("Error fetching student courses:", error);
      return {
        success: false,
        error: this.getErrorMessage(error),
        data: { courses: [] },
      };
    }
  }

  async getStudentResults() {
    try {
      console.log("Loading student results...");
      const userId = await this.getCurrentUserId();

      if (!userId) {
        throw new Error("User not authenticated");
      }

      console.log("Fetching results for user:", userId);

      const [results, gpaData] = await Promise.all([
        this.results.getByStudent(userId).catch((error) => {
          console.warn("Failed to fetch student results:", error);
          return { data: [] };
        }),
        this.results.getGPA(userId).catch((error) => {
          console.warn("Failed to fetch GPA data:", error);
          return null;
        }),
      ]);

      console.log("Results API response:", results);
      console.log("GPA API response:", gpaData);

      // Transform backend data to match frontend expectations
      const transformedResults = this.transformResultsData(
        results.data || results || [],
        gpaData?.data || gpaData
      );

      return {
        success: true,
        data: transformedResults,
      };
    } catch (error) {
      console.error("Error fetching student results:", error);
      return {
        success: false,
        error: this.getErrorMessage(error),
        data: null,
      };
    }
  }

  // Transform backend results data to match frontend structure
  transformResultsData(results, gpaData) {
    if (!Array.isArray(results) || results.length === 0) {
      // Return empty structure when no results
      return {
        overview: {
          currentGPA: 0,
          cumulativeGPA: 0,
          totalCredits: 0,
          completedCourses: 0,
          rank: null,
          totalStudents: null,
        },
        semesters: [],
        achievements: [
          {
            name: "Welcome",
            semester: "Getting Started",
            description: "Ready to begin your academic journey",
          },
        ],
      };
    }

    // Group results by semester/academic year
    const resultsBySemester = {};
    const achievements = [];

    results.forEach((result) => {
      const semesterKey = `${result.academicYear || "Current"}-sem${
        result.semester || 1
      }`;

      if (!resultsBySemester[semesterKey]) {
        resultsBySemester[semesterKey] = {
          id: semesterKey,
          name: `Semester ${result.semester || 1} ${
            result.academicYear || "Current"
          }`,
          gpa: 0,
          credits: 0,
          status: result.completionDate ? "completed" : "current",
          courses: [],
        };
      }

      // Transform course data
      const course = {
        id: result._id,
        name: result.course?.title || "Unknown Course",
        code: result.course?.courseCode || "N/A",
        credits: result.course?.credits || 0,
        grade: result.overallGrade,
        points: this.gradeToPoints(result.overallGrade),
        assignments: this.transformAssessments(result.assessments || []),
      };

      resultsBySemester[semesterKey].courses.push(course);
      resultsBySemester[semesterKey].credits += course.credits;

      // Add achievements for high grades
      if (result.overallGrade === "A+" || result.overallGrade === "A") {
        achievements.push({
          name: "Excellence Award",
          semester: resultsBySemester[semesterKey].name,
          description: `Outstanding performance in ${result.course?.title}`,
        });
      }
    });

    // Calculate GPA for each semester
    Object.values(resultsBySemester).forEach((semester) => {
      if (semester.courses.length > 0) {
        const totalPoints = semester.courses.reduce(
          (sum, course) => sum + course.points * course.credits,
          0
        );
        const totalCredits = semester.credits;
        semester.gpa =
          totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
      }
    });

    const semesters = Object.values(resultsBySemester);
    const currentSemester =
      semesters.find((s) => s.status === "current") || semesters[0];

    // Calculate overall stats
    const totalCredits = semesters.reduce((sum, sem) => sum + sem.credits, 0);
    const completedCourses = semesters.reduce(
      (sum, sem) => sum + sem.courses.length,
      0
    );

    const allCourses = semesters.flatMap((sem) => sem.courses);
    const totalPoints = allCourses.reduce(
      (sum, course) => sum + course.points * course.credits,
      0
    );
    const cumulativeGPA =
      totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;

    return {
      overview: {
        currentGPA: parseFloat(currentSemester?.gpa || 0),
        cumulativeGPA: parseFloat(cumulativeGPA),
        totalCredits,
        completedCourses,
        rank: gpaData?.rank || null,
        totalStudents: gpaData?.totalStudents || null,
      },
      semesters,
      achievements:
        achievements.length > 0
          ? achievements
          : [
              {
                name: "Academic Progress",
                semester: currentSemester?.name || "Current",
                description: "Keep up the excellent work!",
              },
            ],
    };
  }

  // Transform backend assessments to match frontend structure
  transformAssessments(assessments) {
    return assessments.map((assessment) => ({
      name: assessment.name || assessment.type || "Assessment",
      score: assessment.marksObtained,
      total: assessment.totalMarks,
      weight: assessment.weightage || 25, // Default weight if not specified
    }));
  }

  // Convert letter grade to GPA points
  gradeToPoints(grade) {
    if (!grade) return 0.0;

    const gradePoints = {
      "A+": 4.0,
      A: 4.0,
      "A-": 3.7,
      "B+": 3.3,
      B: 3.0,
      "B-": 2.7,
      "C+": 2.3,
      C: 2.0,
      "C-": 1.7,
      D: 1.0,
      F: 0.0,
    };
    return gradePoints[grade] || 0.0;
  }

  async getCourseDetails(courseId) {
    return this.courses.getById(courseId);
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

  // Clear user cache (useful for testing or when user data changes)
  clearUserCache() {
    this._currentUser = null;
    this._userCacheTime = null;
  }
}

const apiService = new ApiService();
export default apiService;
