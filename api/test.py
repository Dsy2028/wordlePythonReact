class Student:
    def __init__(self, firstName,lastName,grade,homeSchool):
        self.first = firstName
        self.last = lastName
        self.grade = grade
        self.homeSchool = homeSchool

    def get_student(self):
        return {
            'first': self.first,
            'last': self.last,
            'grade': self.grade,
            'homeSchool': self.homeSchool
        }

    def get_student_name(self):
        return self.first + ' ' + self.last

    def get_student_home_school(self):
        return self.homeSchool
    
    def get_student_grade(self):
        return self.grade

    def get_student_info(self):
        return {
            'name': self.get_student_name(),
            'grade': self.get_student_grade(),
            'homeSchool': self.get_student_home_school()
        }

s = Student('John', 'Doe', 12, 'Home School')
print(s)