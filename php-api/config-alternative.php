<?php
// Alternative database configuration for Hostinger MySQL
// Try this if the main config doesn't work

// Option 1: localhost
$host = 'localhost';
$port = '3306';
$dbname = 'u128398700_stevenbam';
$username = 'stevenbam';
$password = '$Aragorn60';

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    echo "Database connection successful with localhost!";
} catch (PDOException $e) {
    echo "localhost failed: " . $e->getMessage() . "<br>";
    
    // Option 2: Try with full hostname
    try {
        $host2 = 'u128398700.hostinger.database.host';
        $pdo = new PDO("mysql:host=$host2;port=$port;dbname=$dbname;charset=utf8mb4", $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        echo "Database connection successful with full hostname!";
    } catch (PDOException $e2) {
        echo "Full hostname failed: " . $e2->getMessage() . "<br>";
        echo "Please check your database credentials in Hostinger control panel.";
    }
}
?>