<?php

class Database
{
    private $pdo;

    public function __construct()
    {
        $this->connect();
    }

    private function connect()
    {
        global $Config;

        $dsn = 'mysql:host=' . $Config['DATABASE_ELEMENT']['HOST'] . ';dbname=' . $Config['DATABASE_ELEMENT']['NAME'] . ';charset=utf8mb4';
        try {
            $this->pdo = new PDO($dsn, $Config['DATABASE_ELEMENT']['USERNAME'], $Config['DATABASE_ELEMENT']['PASSWORD']);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            die('Ошибка подключения' . $e->getMessage());
        }
    }

    public function getConnection()
    {
        return $this->pdo;
    }
}