<?php
// Simple test file to debug routing issues

echo "PHP is working!<br>";
echo "Request Method: " . $_SERVER['REQUEST_METHOD'] . "<br>";
echo "Request URI: " . $_SERVER['REQUEST_URI'] . "<br>";
echo "Path: " . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) . "<br>";

// Test database connection
$host = 'localhost';
$port = '3306';
$dbname = 'u128398700_stevenbam';
$username = 'u128398700_stevenbam';
$password = '$Aragorn60';

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    echo "Database connection: SUCCESS<br>";
} catch (PDOException $e) {
    echo "Database connection failed: " . $e->getMessage() . "<br>";
}

// Check if files exist
echo "Files in directory:<br>";
$files = scandir('.');
foreach($files as $file) {
    if($file != '.' && $file != '..') {
        echo "- $file<br>";
    }
}
?>