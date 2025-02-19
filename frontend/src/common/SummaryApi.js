export const baseURL = import.meta.env.VITE_API_URL

const SummaryApi = {
    register: {
        url: "/api/school/register",
        method: "post"
    },
    login: {
        url: "/api/school/login",
        method: "post"
    },
    getSchools: {
        url: "/api/school/all",
        method: "get"
    },
    getSchoolOwnData: {
        url: "/api/school/fetch-single",
        method: "get"
    },
    updateSchool: {
        url: "/api/school/update",
        method: "patch"
    },
    createClass: {
        url: "/api/class/create",
        method: "post"
    },
    getClass: {
        url: "/api/class/all",
        method: "get"
    },
    getAttendeeClass: {
        url: "/api/class/attendee",
        method: "get"
    },
    updateClass: {
        url: "/api/class/update",
        method: "patch"
    },
    deleteClass: {
        url: "/api/class/delete",
        method: "delete"
    },
    createSubject: {
        url: "/api/subject/create",
        method: "post"
    },
    getSubject: {
        url: "/api/subject/all",
        method: "get"
    },
    createStudent: {
        url: "/api/student/register",
        method: "post"
    },
    getStudent: {
        url: "/api/student/all",
        method: "get"
    },
    createTeacher: {
        url: "/api/teacher/register",
        method: "post"
    },
    createNotice: {
        url: "/api/notice/create",
        method: "post"
    },
}

export default SummaryApi