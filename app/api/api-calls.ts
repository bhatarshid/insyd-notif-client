import axios from "axios";

const API_URL = "http://localhost:3000/api/posts";

// export const fetchComments = async (postId) => {
//   try {
//     const response = await axios.get(`${API_URL}?postId=${postId}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching comments:", error);
//     throw error;
//   }
// };

// export const addComment = async (postId, comment) => {
//   try {
//     const response = await axios.post(API_URL, { postId, ...comment });
//     return response.data;
//   } catch (error) {
//     console.error("Error adding comment:", error);
//     throw error;
//   }
// };