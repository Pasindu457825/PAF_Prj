    package com.paf_grp.backend.controller.pamaa;
    import java.io.IOException;
    import java.util.HashMap;
    import java.util.List;
    import java.util.Map;
    import com.paf_grp.backend.constants.RestURI;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.MediaType;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.CrossOrigin;
    import org.springframework.web.bind.annotation.DeleteMapping;
    import org.springframework.web.bind.annotation.GetMapping;
    import org.springframework.web.bind.annotation.PathVariable;
    import org.springframework.web.bind.annotation.PostMapping;
    import org.springframework.web.bind.annotation.PutMapping;
    import org.springframework.web.bind.annotation.RequestMapping;
    import org.springframework.web.bind.annotation.RequestParam;
    import org.springframework.web.bind.annotation.RestController;
    import org.springframework.web.multipart.MultipartFile;

    import com.fasterxml.jackson.core.type.TypeReference;
    import com.fasterxml.jackson.databind.ObjectMapper;

    import com.paf_grp.backend.exception.BadRequestException;
    import com.paf_grp.backend.exception.ResourceNotFoundException;
    import com.paf_grp.backend.model.pamaa.Course;
    import com.paf_grp.backend.model.pamaa.CourseUnit;
    import com.paf_grp.backend.model.pasindu.User;
    import com.paf_grp.backend.repository.pamaa.CourseRepository;
    import com.paf_grp.backend.repository.pamaa.CourseUnitRepository;
    import com.paf_grp.backend.repository.pasindu.UserRepository;
    import com.paf_grp.backend.service.pamaa.FileStorageService;

    @RestController
    @RequestMapping(RestURI.BASE_URL)
    @CrossOrigin("http://localhost:3000")
    public class CourseController {

        @Autowired
        private CourseRepository courseRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private CourseUnitRepository courseUnitRepository;

        @Autowired
        private FileStorageService fileStorageService;

        @Autowired
        private ObjectMapper objectMapper;

        // Get all courses
        @GetMapping(RestURI.ALL_COURSES)
        public List<Course> getAllCourses() {
            return courseRepository.findAll();
        }

        // Create a new course with file upload
        @PostMapping(value = RestURI.CREATE_COURSE, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public Course createCourse(
                @RequestParam("title") String title,
                @RequestParam("description") String description,
                @RequestParam("category") String category,
                @RequestParam("authorId") String authorId,
                @RequestParam("units") String unitsJson,
                @RequestParam(value = "pdfFile", required = false) MultipartFile pdfFile) throws IOException {

            // Ensure the authorId matches the authenticated user
            User author = userRepository.findById(authorId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + authorId));
            System.out.println("Retrieved user: " + author.getId());

            // Create course
            Course course = new Course(title, description, author);
            course.setCategory(category);

            // Handle PDF file if present
            if (pdfFile != null && !pdfFile.isEmpty()) {
                String fileUrl = fileStorageService.storePdfFile(pdfFile);
                course.setPdfFileName(pdfFile.getOriginalFilename());
                course.setPdfFileUrl(fileUrl);
            }

            course = courseRepository.save(course);

            // Extract and add units
            List<Map<String, String>> units = objectMapper.readValue(unitsJson, new TypeReference<List<Map<String, String>>>() {});
            if (units != null) {
                int orderIndex = 0;
                for (Map<String, String> unitData : units) {
                    String unitTitle = unitData.get("title");
                    String unitContent = unitData.get("content");
                    if (unitTitle != null && unitContent != null) {
                        CourseUnit unit = new CourseUnit(unitTitle, unitContent, orderIndex++);
                        unit.setCourse(course);
                        course.addUnit(unit);
                        courseUnitRepository.save(unit);
                    }
                }
            }
            System.out.println("Course object before saving: " + course);
            return courseRepository.save(course);
        }

        // Get course by ID
        @GetMapping("/courses/{id}")
        public ResponseEntity<Course> getCourseById(@PathVariable String id) {
            Course course = courseRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
            return ResponseEntity.ok(course);
        }

        // Update course with file
        @PutMapping(value = "/courses/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<Course> updateCourse(
                @PathVariable String id,
                @RequestParam("title") String title,
                @RequestParam("description") String description,
                @RequestParam("category") String category,
                @RequestParam("requestedByUserId") String requestedByUserId,
                @RequestParam("units") String unitsJson,
                @RequestParam(value = "pdfFile", required = false) MultipartFile pdfFile,
                @RequestParam(value = "replacePdf", required = false, defaultValue = "false") Boolean replacePdf) throws IOException {

            // Find the course
            Course course = courseRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

            // Verify that the requester is the author
            if (!course.getAuthor().getId().equals(requestedByUserId)) {
                throw new BadRequestException("Only the course author can update this course");
            }

            // Update course details
            course.setTitle(title);
            course.setDescription(description);
            course.setCategory(category);

            // Handle PDF file updates
            if (pdfFile != null && !pdfFile.isEmpty()) {
                // Store the new file and update course
                String fileUrl = fileStorageService.storePdfFile(pdfFile);
                course.setPdfFileName(pdfFile.getOriginalFilename());
                course.setPdfFileUrl(fileUrl);
            } else if (Boolean.TRUE.equals(replacePdf)) {
                // If replacePdf is true but no file is provided, remove the existing PDF
                course.setPdfFileName(null);
                course.setPdfFileUrl(null);
            }

            // Handle units updates - first clear existing units
            courseUnitRepository.deleteAll(course.getUnits());
            course.getUnits().clear();

            // Add updated units
            List<Map<String, String>> units = objectMapper.readValue(unitsJson, new TypeReference<List<Map<String, String>>>() {});

            if (units != null) {
                int orderIndex = 0;
                for (Map<String, String> unitData : units) {
                    String unitTitle = unitData.get("title");
                    String unitContent = unitData.get("content");

                    if (unitTitle != null && unitContent != null) {
                        CourseUnit unit = new CourseUnit(unitTitle, unitContent, orderIndex++);
                        course.addUnit(unit);
                    }
                }
            }
            course.getUnits().forEach(unit -> {
                System.out.println("Unit: " + unit.getTitle() + ", ID: " + unit.getId());
            });


            Course updatedCourse = courseRepository.save(course);
            return ResponseEntity.ok(updatedCourse);
        }

        // Delete course
        @DeleteMapping("/courses/{id}")
        public ResponseEntity<?> deleteCourse(@PathVariable String id, @RequestParam String userId) {
            Course course = courseRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
            System.out.println("course id : "+course.getId());
            System.out.println("user id : "+userId);

//            if (course.getAuthor() == null) {
//                throw new BadRequestException("This course does not have an associated author.");
//            }
//            System.out.println("author id from course : "+course.getAuthor().getId());
//            // Verify that the requester is the author
//            if (!course.getAuthor().getId().equals(userId)) {
//                throw new BadRequestException("Only the course author can delete this course");
//            }

            courseRepository.delete(course);

            Map<String, Boolean> response = new HashMap<>();
            response.put("deleted", Boolean.TRUE);

            return ResponseEntity.ok(response);
        }

        // Get courses by author
        @GetMapping("/courses/author/{authorId}")
        public List<Course> getCoursesByAuthor(@PathVariable String authorId) {
            User author = userRepository.findById(authorId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + authorId));

            return courseRepository.findByAuthor(author);
        }

        // Search courses by title
        @GetMapping("/courses/search")
        public List<Course> searchCourses(@RequestParam String query) {
            return courseRepository.findByTitleContainingIgnoreCase(query);
        }

        // Get units for a course
        @GetMapping("/courses/{courseId}/units")
        public List<CourseUnit> getCourseUnits(@PathVariable String courseId) {
            Course course = courseRepository.findById(courseId)
                    .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

            return courseUnitRepository.findByCourseOrderByOrderIndexAsc(course);
        }

        // Get specific unit in a course
        @GetMapping("/courses/{courseId}/units/{unitIndex}")
        public CourseUnit getCourseUnit(@PathVariable String courseId, @PathVariable int unitIndex) {
            Course course = courseRepository.findById(courseId)
                    .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

            List<CourseUnit> units = courseUnitRepository.findByCourseOrderByOrderIndexAsc(course);

            if (unitIndex < 0 || unitIndex >= units.size()) {
                throw new ResourceNotFoundException("Unit not found with index: " + unitIndex);
            }

            return units.get(unitIndex);
        }
    }
