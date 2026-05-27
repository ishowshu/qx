// B站青少年模式接口mock脚本（Quantumult X）
const base64Data = "AAAAABMKEQgCEgl0ZWVuYWdlcnMgAioA"; // Base64数据

const status = "HTTP/2 200";
const headers = {
    "Content-Type": "application/grpc" // gRPC内容类型
};

const response = {
    status: status,
    headers: headers,
    body: base64Data
};

$done(response);
