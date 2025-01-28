export const baseURL = import.meta.env.VITE_API_URL

const SummaryApi = {
    register: {
        url: "/api/school/register",
        method: "post"
    }
}

export default SummaryApi