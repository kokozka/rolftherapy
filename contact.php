<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Nepovolená metoda.']);
    exit;
}

$jmeno   = trim($_POST['jmeno']   ?? '');
$email   = trim($_POST['email']   ?? '');
$telefon = trim($_POST['telefon'] ?? '');
$adresa  = trim($_POST['adresa']  ?? '');
$zprava  = trim($_POST['zprava']  ?? '');

$errors = [];

if ($zprava === '') {
    $errors[] = 'Zpráva je povinná.';
}

if ($email === '' && $telefon === '') {
    $errors[] = 'Vyplňte e-mail nebo telefon.';
}

if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'E-mail má nesprávný formát.';
}

if ($telefon !== '' && !preg_match('/^\+?[\d\s\-(). ]{9,20}$/', $telefon)) {
    $errors[] = 'Telefon má nesprávný formát.';
}

if (!empty($errors)) {
    echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
    exit;
}

$to      = 'info@rolftherapy.cz';
$subject = 'Zpráva z webu od ' . ($jmeno ?: 'anonymního návštěvníka');

$body  = "Nová zpráva z kontaktního formuláře:\n\n";
if ($jmeno)   $body .= "Jméno:   {$jmeno}\n";
if ($email)   $body .= "E-mail:  {$email}\n";
if ($telefon) $body .= "Telefon: {$telefon}\n";
if ($adresa)  $body .= "Adresa:  {$adresa}\n";
$body .= "\nZpráva:\n{$zprava}\n";

$replyTo = $email ?: 'noreply@rolftherapy.cz';
$headers  = "From: noreply@rolftherapy.cz\r\n";
$headers .= "Reply-To: {$replyTo}\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$sent = mail($to, $encodedSubject, $body, $headers);

if ($sent) {
    echo json_encode(['success' => true, 'message' => 'Vaše zpráva byla odeslána. Brzy se vám ozveme.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Zprávu se nepodařilo odeslat. Zkuste nás kontaktovat přímo.']);
}
