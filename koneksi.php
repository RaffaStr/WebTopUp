<?php
// Konfigurasi Database
$host = "localhost";
$user = "root";
$pass = "";
$db   = "raffa_store_db";

// Sambungkan ke MySQL
$conn = mysqli_connect($host, $user, $pass, $db);

// Cek jika gagal
if (!$conn) {
    die("Gagal Konek Database: " . mysqli_connect_error());
}
?>