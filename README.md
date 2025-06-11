☁️ Raspberry Pi Cloud Storage using Nextcloud + Tailscale
📝 Overview
This project demonstrates how we turned a Raspberry Pi 5 into a self-hosted personal cloud storage system using Nextcloud for cloud functionality and Tailscale for secure, global access—without needing a static IP or complicated port forwarding.

⚙️ What We Built
We created a compact private cloud solution by combining:

Raspberry Pi 5 as the main server

Nextcloud as the cloud platform for file access and sharing

Tailscale (with Funnel) to enable access from anywhere securely

A 120GB USB drive (used for testing) mounted as external storage

Initially, the setup was accessible over our local network. Later, we used Tailscale to securely expose the server to the internet.

🔧 Setup Guide
🔹 Step 1: Mounting the USB Storage
Begin by formatting and mounting the external drive:

bash
Copy
Edit
lsblk
sudo fdisk -l
sudo mkdir /mnt/mydrive
sudo mount /dev/sda1 /mnt/mydrive
sudo chown -R pi:pi /mnt/mydrive
sudo nano /etc/fstab   # Optional: auto-mount on reboot
df -h
🔹 Step 2: Installing Nextcloud
Update the OS:

bash
Copy
Edit
sudo apt update && sudo apt upgrade -y
Install Apache:

bash
Copy
Edit
sudo apt install apache2 -y
sudo systemctl enable apache2
sudo systemctl start apache2
Set up MariaDB and create the Nextcloud database:

bash
Copy
Edit
sudo apt install mariadb-server -y
sudo mysql_secure_installation
sudo mysql -u root -p
Inside the MySQL prompt:

sql
Copy
Edit
CREATE DATABASE nextcloud;
CREATE USER 'nextclouduser'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON nextcloud.* TO 'nextclouduser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
Install PHP and required modules:

bash
Copy
Edit
sudo apt install php libapache2-mod-php php-mysql php-xml php-mbstring php-zip php-curl php-gd php-intl php-bcmath -y
Download and extract Nextcloud:

bash
Copy
Edit
cd /tmp
wget https://download.nextcloud.com/server/releases/latest.zip
sudo apt install unzip
unzip latest.zip
sudo mv nextcloud /var/www/html/
Set appropriate permissions:

bash
Copy
Edit
sudo chown -R www-data:www-data /var/www/html/nextcloud
sudo chmod -R 755 /var/www/html/nextcloud
🔹 Step 3: Tailscale Setup
Install and start Tailscale:

bash
Copy
Edit
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
sudo systemctl enable tailscaled
🔹 Step 4: Expose to the Internet (Tailscale Funnel)
To make the cloud server publicly available, use:

bash
Copy
Edit
sudo tailscale funnel 80
Or test locally with:

bash
Copy
Edit
python3 -m http.server 3000
sudo tailscale funnel 3000
Tailscale will provide a URL like:

arduino
Copy
Edit
https://yourdevice.tailnet-name.ts.net/
🔹 Step 5: Add Tailscale URL to Nextcloud's Trusted Domains
Edit the config file:

bash
Copy
Edit
sudo nano /var/www/html/nextcloud/config/config.php
Add the Tailscale domain to the 'trusted_domains' array:

php
Copy
Edit
'trusted_domains' => array (
  0 => '192.168.x.xxx',
  1 => 'yourdevice.tailnet-name.ts.net',
),
🔹 Step 6: Restart Apache
bash
Copy
Edit
sudo systemctl restart apache2
✅ That’s it! You now have a fully working cloud storage system accessible both locally and globally.

📌 Final Note
This setup was built and tested using a 120GB drive for demo purposes, but it's scalable for larger storage. It's a great budget-friendly alternative to commercial cloud storage with full control and privacy.

