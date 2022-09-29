/******** Student ********/

-- get all student data
SELECT * FROM `Student`;

-- add a new student
INSERT INTO `Student` (`first_name`, `last_name`, `email`, `type`)
VALUES (:firstNameInput, :lastNameInput, :emailInput, :typeInput);

-- update a student's data
UPDATE `Student` SET
	`first_name` = :firstNameInput,
	`last_name`= :lastNameInput,
	`email` = :emailInput,
	`type` = :typeInput
WHERE `id`= :studentId;

-- delete a student
DELETE FROM `Student` WHERE `id` = :studentId;

-- get all students by name and/or type
SELECT *
FROM Student
WHERE (first_name, ' ', last_name) LIKE CONCAT(:firstNameInput, ' ', :lastNameInput) AND type = :typeInput
ORDER BY first_name, last_name;

/******** Course_Student ********/

-- get a list of courses to populate the course dropdown
SELECT c.`name`, c.`year`, c.`term` FROM `Course`;

-- get all students enrolled in the input course
SELECT s.* FROM `Course_Student` cs
INNER JOIN `Student` s ON cs.`student_id` = s.`student_id`
WHERE cs.`course_id` = :courseId;

-- add a new course student relationship
INSERT INTO `Course_Student` (`course_id`, `student_id`) VALUES (:courseId, :studentId);

-- delete a course student relationship
DELETE FROM `Course_Student` WHERE `course_id` = :courseId AND `student_id` = :studentId;

/******** Textbook ********/

-- get all textbook data
SELECT * FROM `Textbook`;

-- add a new textbook
INSERT INTO `Textbook` (`textbook_isbn`, `name`, `author`)
VALUES (:isbnInput, :nameInput, :authorInput);

-- update a textbook's data
UPDATE `Textbook` SET
	`textbook_isbn` = :isbnInput, 
    	`name` = :nameInput, 
    	`author` = :authorInput
WHERE `textbook_id` = :textbookIdInput;

-- delete a textbook
DELETE FROM `Textbook` WHERE `textbook_id` = :textbookIdInput;

-- filter textbooks by name
SELECT * FROM `Textbook` WHERE `name` LIKE CONCAT('%', :nameInput, '%');

-- filter textbooks by ISBN
SELECT * FROM `Textbook` WHERE `textbook_isbn` LIKE CONCAT('%', :isbnInput, '%');

-- filter textbooks by author
SELECT * FROM `Textbook` WHERE `author` LIKE CONCAT('%', :authorInput, '%');

/******** Instructor ********/

-- get all instructors
SELECT * FROM `Instructor` ORDER BY first_name, last_name;

-- add a new instructor
INSERT INTO `Instructor` (`first_name`, `last_name`, `email`)
VALUES (:first_name, :last_name, :email);

-- update an instructor's data
UPDATE `Instructor` SET
	`first_name` = :first_name, 
    	`last_name` = :last_name, 
    	`email` = email
WHERE `instructor_id` = :instructor_id;

-- delete an instructor
DELETE FROM `Instructor` WHERE `instructor_id` = :instructor_id;

-- filter instructors by input name
SELECT * FROM `Instructor` WHERE CONCAT(`first_name`, ' ', `last_name`) LIKE CONCAT('%', :name, '%');

/******** Course ********/

-- get all course data
SELECT c.course_id, c.name, c.year, c.term, i.instructor_id, CONCAT(i.first_name, ' ', i.last_name) as 'instructor_name', t.textbook_id, t.name as 'textbook_title' 
FROM Course c 
INNER JOIN Instructor i ON c.instructor_id = i.instructor_id 
LEFT JOIN Textbook t ON c.textbook_id = t.textbook_id
ORDER BY c.year DESC, c.term, c.name;

-- add a new course
INSERT INTO `Course` (`name`, `year`, `term`, `instructor_id`, `textbook_id`)
VALUES (:name, :year, :term, :instructor_id, :textbook_id);

-- delete a course
DELETE FROM `Course` WHERE `course_id` = :course_id;

-- update a course's data
UPDATE `Course` SET 
	`name` = :name, 
    	`year` = :year, 
    	`term` = :term, 
    	`instructor_id` = :instructor_id, 
    	`textbook_id` = :textbook_id;
WHERE `course_id` = :course_id;

-- filter courses by name
SELECT c.course_id, c.name, c.year, c.term, CONCAT(i.first_name, ' ', i.last_name) as 'Instructor', t.name as 'Textbook Title' 
FROM Course c 
INNER JOIN Instructor i ON c.instructor_id = i.instructor_id 
LEFT JOIN Textbook t ON c.textbook_id = t.textbook_id
WHERE c.name LIKE CONCAT('%', :name, '%');

-- filter courses by term and year
SELECT c.course_id, c.name, c.year, c.term, CONCAT(i.first_name, ' ', i.last_name) as 'Instructor', t.name as 'Textbook Title' 
FROM Course c 
INNER JOIN Instructor i ON c.instructor_id = i.instructor_id 
LEFT JOIN Textbook t ON c.textbook_id = t.textbook_id
WHERE (`year` = :year OR :year IS NULL) OR (`term` = :term OR :term IS NULL);

-- filter courses by instructor name
SELECT c.course_id, c.name, c.year, c.term, CONCAT(i.first_name, ' ', i.last_name) as 'Instructor', t.name as 'Textbook Title' 
FROM Course c 
INNER JOIN Instructor i ON c.instructor_id = i.instructor_id 
LEFT JOIN Textbook t ON c.textbook_id = t.textbook_id
WHERE CONCAT(i.first_name, ' ', i.last_name) LIKE CONCAT ('%', :instructor_name, '%');
