☁️ Raspberry Pi Cloud Storage using Nextcloud + Tailscale

📝 Overview

This project shows how we built a **personal cloud server** using a **Raspberry Pi 5**, **Nextcloud**, and **Tailscale**. It offers secure, global access to your files **without needing a static IP or port forwarding**.

We initially accessed the setup over a local network and later enabled global access using Tailscale's **Funnel** feature.

⚙️ Components Used

- **Raspberry Pi 5** (main server)
- **Nextcloud** (self-hosted cloud software)
- **Tailscale + Funnel** (secure remote access)
- **120GB USB storage** (for testing)

---

🔧 Step-by-Step Setup

🔹 Step 1: Mount External USB Storage

```bash
lsblk
sudo fdisk -l
sudo mkdir /mnt/mydrive
sudo mount /dev/sda1 /mnt/mydrive
sudo chown -R pi:pi /mnt/mydrive
sudo nano /etc/fstab   # Optional: auto-mount on boot
df -h
````

---

🔹 Step 2: Install and Configure Nextcloud

Update packages:

```bash
sudo apt update && sudo apt upgrade -y
```

Install Apache web server:

```bash
sudo apt install apache2 -y
sudo systemctl enable apache2
sudo systemctl start apache2
```

Install MariaDB and set it up:

```bash
sudo apt install mariadb-server -y
sudo mysql_secure_installation
sudo mysql -u root -p
```

In MySQL shell:

```sql
CREATE DATABASE nextcloud;
CREATE USER 'nextclouduser'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON nextcloud.* TO 'nextclouduser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```
Install PHP and required extensions:

```bash
sudo apt install php libapache2-mod-php php-mysql php-xml php-mbstring php-zip php-curl php-gd php-intl php-bcmath -y
```

Download and configure Nextcloud:

```bash
cd /tmp
wget https://download.nextcloud.com/server/releases/latest.zip
sudo apt install unzip
unzip latest.zip
sudo mv nextcloud /var/www/html/
```
Set permissions:

```bash
sudo chown -R www-data:www-data /var/www/html/nextcloud
sudo chmod -R 755 /var/www/html/nextcloud
```

---
🔹 Step 3: Install and Set Up Tailscale

```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
sudo systemctl enable tailscaled
```

---

🔹 Step 4: Enable Global Access with Tailscale Funnel

Run a basic HTTP server (for testing):

```bash
python3 -m http.server 3000
sudo tailscale funnel 3000
```

Or expose your Apache server:

```bash
sudo tailscale funnel 80
```

You will receive a public URL like:

```
https://yourpi.tailnet-name.ts.net/
```

---

🔹 Step 5: Add Tailscale Domain to Nextcloud Trusted Domains

```bash
sudo nano /var/www/html/nextcloud/config/config.php
```

Example trusted domain entry:

```php
'trusted_domains' => array (
  0 => '192.168.1.10',
  1 => 'yourpi.tailnet-name.ts.net',
),
```

---

🔹 Step 6: Restart Apache

```bash
sudo systemctl restart apache2
```

---

✅ Final Output

Your **Raspberry Pi-powered private cloud** is now accessible globally through the Tailscale-provided URL and locally via LAN.

---

📌 Notes

* This guide used a 120GB USB drive for demo purposes; it can be scaled up easily.
* Make sure to secure your Nextcloud setup with HTTPS and strong passwords for real-world usage.

---

🔗 Useful Links

* [Nextcloud Official Downloads](https://nextcloud.com/install/#instructions-server)
* [Tailscale Official Website](https://tailscale.com/)
* [Raspberry Pi OS Download](https://www.raspberrypi.com/software/)
