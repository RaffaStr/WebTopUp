<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include 'koneksi.php'; // Panggil jembatan tadi

// 1. Ambil data JSON yang dikirim dari script.js
$json = file_get_contents("php://input");
$data = json_decode($json);

// Cek apakah ada data yang masuk
if(isset($data->invoiceId)) {

    // 2. Siapkan variabel biar aman
    $invoice   = $data->invoiceId;
    $game      = $data->gameName;
    $item      = $data->itemName;
    $price     = $data->itemPrice;
    $userData  = $data->userData;
    $status    = "Pending"; // Status awal selalu Pending

    // 3. Masukkan ke Database (Query INSERT)
    $sql = "INSERT INTO orders (invoice_id, game_name, item_name, price, status, user_data, date) 
            VALUES ('$invoice', '$game', '$item', '$price', '$status', '$userData', NOW())";

    if(mysqli_query($conn, $sql)) {
        // Berhasil
        echo json_encode(["message" => "Berhasil", "status" => "success"]);
    } else {
        // Gagal
        echo json_encode(["message" => "Gagal: " . mysqli_error($conn), "status" => "error"]);
    }

} else {
    echo json_encode(["message" => "Data kosong", "status" => "error"]);
}
?>