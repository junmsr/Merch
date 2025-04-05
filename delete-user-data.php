<?php
// Check if the request is valid (e.g., verify a token or user ID)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userId = $_POST['user_id']; // Example: Get user ID from the request

    // Perform the deletion logic (e.g., remove user data from the database)
    // ...existing code...
    // Example:
    // $db->query("DELETE FROM users WHERE id = ?", [$userId]);

    // Respond to Facebook with a success message
    echo json_encode(['status' => 'success', 'message' => 'User data deleted']);
} else {
    // If the request is invalid, return an error
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
}
?>
