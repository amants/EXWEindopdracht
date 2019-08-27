-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Gegenereerd op: 27 aug 2019 om 14:18
-- Serverversie: 5.7.26
-- PHP-versie: 7.3.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `exw_highscores`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `hiscores`
--

CREATE TABLE `hiscores` (
  `id` int(11) NOT NULL,
  `username` varchar(8) NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `score` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Gegevens worden geëxporteerd voor tabel `hiscores`
--

INSERT INTO `hiscores` (`id`, `username`, `date`, `score`) VALUES
(1, 'SAM', '2019-08-24 22:25:01', 0),
(2, 'Rexani', '2019-08-26 17:20:49', 1),
(3, 'UNNAMED', '2019-08-26 17:31:02', 18),
(4, 'ABC', '2019-08-26 17:33:02', 24),
(5, 'HAHA', '2019-08-26 17:35:43', 7),
(6, 'HAHA', '2019-08-26 17:36:29', 119),
(7, 'HAHA', '2019-08-26 17:36:53', 7),
(8, 'HAHA', '2019-08-26 17:36:58', 2),
(9, 'HAHA', '2019-08-26 17:37:05', 4),
(10, 'HAHA', '2019-08-26 17:37:09', 4),
(11, 'HAHA', '2019-08-26 17:37:13', 4),
(12, 'HAHA', '2019-08-26 17:37:19', 4),
(13, 'HAHA', '2019-08-26 17:37:31', 2),
(14, 'HAHA', '2019-08-26 17:37:40', 12),
(15, 'HAHA', '2019-08-26 17:37:44', 2),
(16, 'HAHA', '2019-08-26 17:37:48', 2),
(17, 'UNNAMED', '2019-08-26 17:42:24', 36),
(18, 'UNNAMED', '2019-08-26 17:42:33', 13),
(19, 'UNNAMED', '2019-08-26 17:44:36', 96),
(20, 'BCDW', '2019-08-26 18:06:41', 31),
(21, 'SAM', '2019-08-26 18:27:39', 54),
(22, 'A', '2019-08-26 18:45:35', 37),
(23, 'UNNAMED', '2019-08-26 18:49:07', 6),
(24, 'UNNAMED', '2019-08-26 18:49:14', 4),
(25, 'UNNAMED', '2019-08-26 18:49:45', 27),
(26, 'UNNAMED', '2019-08-26 18:50:08', 30);

--
-- Indexen voor geëxporteerde tabellen
--

--
-- Indexen voor tabel `hiscores`
--
ALTER TABLE `hiscores`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT voor geëxporteerde tabellen
--

--
-- AUTO_INCREMENT voor een tabel `hiscores`
--
ALTER TABLE `hiscores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
