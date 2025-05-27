import axios from "axios";
import apiConfig from "../config/apiConfig";

const makeNotificationToSomeone = async (title, body, type, sendTo) => {
    try {
        const token = JSON.parse(localStorage.getItem("user"));
        if (!token) {
            throw new Error("Token không có trong localStorage");
        }
        const config = {
            headers: {
                token: `Bearer ${token.accessToken}`,
                "Content-Type": "application/json",
            },
        };

        const data = {
            title: title,
            body: body,
            type: type,
        };
        console.log(data);


        // Gửi POST request đến API
        const response = await axios.post(
            `${apiConfig.serverURL}/v1/app/notification/post_for_someone/${sendTo}`,
            data,
            config
        );
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Đã xảy ra lỗi khi tạo thông báo");
        }
    } catch (error) {
        console.error("Lỗi khi gửi thông báo:", error);
        throw error;
    }
};

// Xuất hàm để sử dụng ở nơi khác
export default makeNotificationToSomeone;
