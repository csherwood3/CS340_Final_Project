-- SQL Database Setup

-- drop existing tables
DROP TABLE IF EXISTS `Course_Student`;
DROP TABLE IF EXISTS `Student`;
DROP TABLE IF EXISTS `Course`;
DROP TABLE IF EXISTS `Textbook`;
DROP TABLE IF EXISTS `Instructor`;

-- create Instructor table
CREATE TABLE `Instructor` (
  `instructor_id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- create Textbook table
CREATE TABLE `Textbook` (
  `textbook_id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `textbook_isbn` VARCHAR(255),
  `name` VARCHAR(255) NOT NULL,
  `author` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- create Course table
CREATE TABLE `Course` (
  `course_id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `year` INT(4) NOT NULL,
  `term` VARCHAR(20) NOT NULL,
  `instructor_id` INT(11) NOT NULL,
  `textbook_id` INT(11),
  CONSTRAINT `course_instructor_fk`
    FOREIGN KEY (`instructor_id`)
    REFERENCES `Instructor` (`instructor_id`)
    ON UPDATE CASCADE,
  CONSTRAINT `course_textbook_fk`
    FOREIGN KEY (`textbook_id`)
    REFERENCES `Textbook` (`textbook_id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- create Student table
CREATE TABLE `Student` (
  `student_id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `type` VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- create Course_Student table
CREATE TABLE `Course_Student` (
  `course_id` INT(11) NOT NULL,
  `student_id` INT(11) NOT NULL,
  PRIMARY KEY (`course_id`, `student_id`),
  CONSTRAINT `course_student_course_fk`
    FOREIGN KEY (`course_id`)
    REFERENCES `Course` (`course_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `course_student_student_fk`
    FOREIGN KEY (`student_id`)
    REFERENCES `Student` (`student_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for Instructor table
LOCK TABLES `Instructor` WRITE;
INSERT INTO `Instructor` VALUES
  (1, 'Steve', 'Jobs', 'stevejobs@123.com'),
  (2, 'Bill', 'Gates', 'billgates@123.com');
UNLOCK TABLES;
ALTER TABLE `Instructor`
  MODIFY `instructor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 3;

-- Dumping data for Textbook table
LOCK TABLES `Textbook` WRITE;
INSERT INTO `Textbook` VALUES
  (1, NULL, 'Title1', 'Author1'),
  (2, NULL, 'Title2', 'Author2');
UNLOCK TABLES;
ALTER TABLE `Textbook`
  MODIFY `textbook_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 3;

-- Dumping data for Course table
LOCK TABLES `Course` WRITE;
INSERT INTO `Course` VALUES
  (1, 'Introduction to Databases', 2021, 'Fall', 1, 1),
  (2, 'Intro to Computer Networks', 2021, 'Fall', 2, NULL);
UNLOCK TABLES;
ALTER TABLE `Course`
  MODIFY `course_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 3;

-- Dumping data for Student table
LOCK TABLES `Student` WRITE;
INSERT INTO `Student` VALUES
  (1, 'Charles', 'Sherwood', 'charlessherwood@123.com', 'Post-Bacc'),
  (2, 'Hsing-Yi', 'Lin', 'hsingyilin@123.com', 'Post-Bacc');
UNLOCK TABLES;
ALTER TABLE `Student`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 3;

-- Dumping data for Course_Student table
LOCK TABLES `Course_Student` WRITE;
INSERT INTO `Course_Student` VALUES
  (1, 1),
  (2, 1),
  (2, 2);
UNLOCK TABLES;
