import payload from 'payload';
import path from 'path';

let cached = (global as any).payload;

if (!cached) {
    cached = (global as any).payload = { client: null, promise: null };
}

export const getPayloadClient = async () => {
    if (cached.client) {
        return cached.client;
    }

    if (!cached.promise) {
        // Đảm bảo Payload tìm thấy file config trong môi trường Vercel (Serverless)
        if (!process.env.PAYLOAD_CONFIG_PATH) {
            // Trong Vercel, chúng ta trỏ trực tiếp đến file gốc
            process.env.PAYLOAD_CONFIG_PATH = path.resolve(process.cwd(), 'payload.config.ts');
        }

        cached.promise = payload.init({
            secret: process.env.PAYLOAD_SECRET,
            mongoURL: process.env.MONGODB_URI,
            local: true,
        });
    }

    try {
        cached.client = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.error('Lỗi khi khởi tạo Payload:', e);
        throw e;
    }

    return cached.client;
};
