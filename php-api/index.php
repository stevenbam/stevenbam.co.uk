<?php
// Main API router - equivalent to your C# Program.cs routing
// This handles all incoming requests and routes them to the right endpoint

require_once 'config.php';

// Get the request method and path (like your C# [HttpGet], [HttpPost] attributes)
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Keep /api prefix to match your frontend expectations
// $path = preg_replace('#^/api#', '', $path);

// Route requests to appropriate handlers (like your C# controllers)
switch (true) {
    // Blog endpoints - matches your BlogController.cs
    case $method === 'GET' && $path === '/api/blog':
        require_once 'blog.php';
        getAllBlogPosts($pdo);
        break;
        
    case $method === 'GET' && preg_match('#^/api/blog/(\d+)$#', $path, $matches):
        require_once 'blog.php';
        getBlogPost($pdo, $matches[1]);
        break;
        
    case $method === 'POST' && $path === '/api/blog':
        require_once 'blog.php';
        createBlogPost($pdo);
        break;
        
    case $method === 'PUT' && preg_match('#^/api/blog/(\d+)$#', $path, $matches):
        require_once 'blog.php';
        updateBlogPost($pdo, $matches[1]);
        break;
        
    case $method === 'DELETE' && preg_match('#^/api/blog/(\d+)$#', $path, $matches):
        require_once 'blog.php';
        deleteBlogPost($pdo, $matches[1]);
        break;

    // Photo endpoints - matches your PhotoController.cs
    case $method === 'GET' && $path === '/api/photo':
        require_once 'photo.php';
        getAllPhotos($pdo);
        break;
        
    case $method === 'GET' && preg_match('#^/api/photo/(\d+)$#', $path, $matches):
        require_once 'photo.php';
        getPhoto($pdo, $matches[1]);
        break;
        
    case $method === 'GET' && preg_match('#^/api/photo/(\d+)/file$#', $path, $matches):
        require_once 'photo.php';
        getPhotoFile($pdo, $matches[1]);
        break;
        
    case $method === 'POST' && $path === '/api/photo':
        require_once 'photo.php';
        uploadPhoto($pdo);
        break;
        
    case $method === 'DELETE' && preg_match('#^/api/photo/(\d+)$#', $path, $matches):
        require_once 'photo.php';
        deletePhoto($pdo, $matches[1]);
        break;

    // Default case - endpoint not found (like your C# 404 handling)
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
        break;
}
?>