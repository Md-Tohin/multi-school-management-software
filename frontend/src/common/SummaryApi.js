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
    }
}

export default SummaryApi