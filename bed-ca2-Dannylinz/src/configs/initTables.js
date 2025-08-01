const pool = require("../services/db");

const bcrypt = require("bcrypt");
const saltRounds = 10;

bcrypt.hash("1234", saltRounds, (error, hash) => {
  if (error) {
    console.error("Error hashing password:", error);
  } else {
    console.log("Hashed password:", hash);

    const SQL = `
    SET FOREIGN_KEY_CHECKS = 0;

    DROP TABLE IF EXISTS UserItems;
    DROP TABLE IF EXISTS Quest;
    DROP TABLE IF EXISTS SurveyQuestion;
    DROP TABLE IF EXISTS UserAnswer;
    DROP TABLE IF EXISTS Messages;
    DROP TABLE IF EXISTS TaskProgress;
    DROP TABLE IF EXISTS Task;
    DROP TABLE IF EXISTS User;
    DROP TABLE IF EXISTS Items;
    DROP TABLE IF EXISTS Reviews;

    SET FOREIGN_KEY_CHECKS = 1;

    CREATE TABLE User (
      user_id INT AUTO_INCREMENT PRIMARY KEY,
      username TEXT NOT NULL,
      points INT NOT NULL DEFAULT 0,
      level INT NOT NULL DEFAULT 1,
      price INT DEFAULT 0,
      email TEXT NOT NULL,
      password TEXT NOT NULL,
      player_name TEXT, 
      gender ENUM('boy', 'girl'),
      created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE Reviews (
      id INT PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(255) NOT NULL,
      user_id TEXT NOT NULL,
      rating INT NOT NULL DEFAULT 0,
      review_text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE Task (
      task_id INT PRIMARY KEY AUTO_INCREMENT,
      title TEXT,
      description TEXT,
      points INT,
      user_id INT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES User(user_id)
    );

    CREATE TABLE TaskProgress (
      progress_id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      task_id INT NOT NULL,
      completion_date TIMESTAMP,
      notes TEXT
    );

    CREATE TABLE Messages (
      id INT PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(255) NOT NULL,
      user_id TEXT NOT NULL,
      message_text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE UserAnswer (
      answer_id INT AUTO_INCREMENT PRIMARY KEY,
      answered_question_id INT NOT NULL,
      participant_id INT NOT NULL,
      answer BOOL NOT NULL,
      creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      additional_notes TEXT
    );

    CREATE TABLE SurveyQuestion (
      question_id INT AUTO_INCREMENT PRIMARY KEY,
      creator_id INT NOT NULL,
      question TEXT NOT NULL
    );

    CREATE TABLE Quest (
      quest_id INT PRIMARY KEY AUTO_INCREMENT,
      quest_name VARCHAR(255) NOT NULL,
      quest_description TEXT,
      level INT DEFAULT 1,
      price INT DEFAULT 0,
      status VARCHAR(255) DEFAULT 'available',
      created_by_username VARCHAR(255) NOT NULL,
      completed_by_username VARCHAR(255)
    );

    CREATE TABLE Items (
      item_id INT AUTO_INCREMENT PRIMARY KEY,
      item_name VARCHAR(255) NOT NULL,
      item_type VARCHAR(255) NOT NULL,
      item_description TEXT,
      price INT NOT NULL,
      level INT NOT NULL
    );

    CREATE TABLE UserItems (
      user_item_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      item_id INT NOT NULL,
      purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES User(user_id),
      FOREIGN KEY (item_id) REFERENCES Items(item_id)
    );

    INSERT INTO User (username, points, email, password) VALUES
    ('user1', 0, 'user1@example.com', '${hash}'),
    ('user2', 0, 'user2@example.com', '${hash}');

    INSERT INTO SurveyQuestion (question_id, creator_id, question) VALUES
    (1, 1, "Do you buy fruits from FC6?"),
    (2, 1, "Is the fried chicken at FC5 salty?"),
    (3, 2, "Did you recycle any e-waste?"),
    (4, 2, "Do you turn off lights and appliances when not in use?"),
    (5, 2, "Have you visited the cafe at Moberly?");

    INSERT INTO Task (title, description, points, user_id) VALUES
    ('Plant a Tree', 'Plant a tree in your neighborhood or a designated green area.', 50, 1),
    ('Use Public Transportation', 'Use public transportation or carpool instead of driving alone.', 30, 1),
    ('Reduce Plastic Usage', 'Commit to using reusable bags and containers.', 40, 2),
    ('Energy Conservation', 'Turn off lights and appliances when not in use.', 25, 2),
    ('Composting', 'Start composting kitchen scraps to create natural fertilizer.', 35, 2);

    INSERT INTO Items (item_name, item_type, item_description, price, level) VALUES
    -- Level 1 Items
    ('Iron Helmet', 'Helmet', 'A sturdy iron helmet.', 100, 1),
    ('Steel Breastplate', 'Breastplate', 'A strong steel breastplate.', 200, 1),
    ('Longsword', 'Weapon', 'A sharp and long sword.', 150, 1),
    ('Shield', 'Weapon', 'A large shield for protection.', 120, 1),
    ('Leather Boots', 'Boots', 'Durable leather boots.', 80, 1),

    -- Level 2 Items
    ('Bronze Helmet', 'Helmet', 'A helmet made of bronze.', 150, 2),
    ('Iron Breastplate', 'Breastplate', 'A reinforced iron breastplate.', 300, 2),
    ('Mace', 'Weapon', 'A heavy bronze mace.', 200, 2),
    ('Tower Shield', 'Weapon', 'A large tower shield.', 180, 2),
    ('Reinforced Leather Boots', 'Boots', 'Leather boots with extra reinforcements.', 120, 2),

    -- Level 3 Items
    ('Silver Helmet', 'Helmet', 'A helmet made of silver.', 200, 3),
    ('Steel Breastplate', 'Breastplate', 'A steel breastplate with additional armor.', 400, 3),
    ('Battleaxe', 'Weapon', 'A large and heavy battleaxe.', 250, 3),
    ('Round Shield', 'Weapon', 'A round shield made of steel.', 220, 3),
    ('Steel Boots', 'Boots', 'Durable steel boots.', 160, 3),

    -- Level 4 Items
    ('Golden Helmet', 'Helmet', 'A golden helmet adorned with jewels.', 300, 4),
    ('Diamond Breastplate', 'Breastplate', 'A breastplate encrusted with diamonds.', 600, 4),
    ('Warhammer', 'Weapon', 'A powerful warhammer with intricate designs.', 300, 4),
    ('Large Kite Shield', 'Weapon', 'A large kite-shaped shield.', 280, 4),
    ('Magical Boots', 'Boots', 'Boots with magical enhancements.', 200, 4),

    -- Level 5 Items
    ('Platinum Helmet', 'Helmet', 'A helmet made of platinum.', 400, 5),
    ('Dragonscale Breastplate', 'Breastplate', 'A breastplate made from dragon scales.', 800, 5),
    ('Enchanted Sword', 'Weapon', 'A sword with magical properties.', 350, 5),
    ('Divine Shield', 'Weapon', 'A shield blessed by the gods.', 320, 5),
    ('Mythical Boots', 'Boots', 'Boots of legendary craftsmanship.', 250, 5),

    -- Level 6 Items
    ('Obsidian Helmet', 'Helmet', 'A helmet made from black obsidian.', 500, 6),
    ('Celestial Breastplate', 'Breastplate', 'A breastplate forged in celestial fires.', 1000, 6),
    ('Stormbreaker', 'Weapon', 'A weapon that controls lightning.', 400, 6),
    ('Ethereal Shield', 'Weapon', 'A shield made of ethereal energy.', 360, 6),
    ('Dragonskin Boots', 'Boots', 'Boots made from the skin of ancient dragons.', 300, 6),

    -- Level 7 Items
    ('Meteorite Helmet', 'Helmet', 'A helmet forged from meteorite metal.', 600, 7),
    ('Ebonite Breastplate', 'Breastplate', 'A breastplate made from ebonite.', 1200, 7),
    ('Inferno Sword', 'Weapon', 'A sword engulfed in flames.', 450, 7),
    ('Celestial Shield', 'Weapon', 'A shield with celestial power.', 400, 7),
    ('Phoenix Boots', 'Boots', 'Boots that grant the power of rebirth.', 350, 7),

    -- Level 8 Items
    ('Galactic Helmet', 'Helmet', 'A helmet infused with galactic energy.', 700, 8),
    ('Starfire Breastplate', 'Breastplate', 'A breastplate forged from starfire.', 1400, 8),
    ('Lunar Blade', 'Weapon', 'A blade infused with lunar energy.', 500, 8),
    ('Void Shield', 'Weapon', 'A shield that absorbs all energy.', 440, 8),
    ('Celestial Boots', 'Boots', 'Boots that enhance speed and agility.', 400, 8),

    -- Level 9 Items
    ('Eclipse Helmet', 'Helmet', 'A helmet that channels solar and lunar energy.', 800, 9),
    ('Astral Breastplate', 'Breastplate', 'A breastplate made from astral materials.', 1600, 9),
    ('Galactic Staff', 'Weapon', 'A staff with galactic power.', 550, 9),
    ('Cosmic Shield', 'Weapon', 'A shield with cosmic energy.', 480, 9),
    ('Infinity Boots', 'Boots', 'Boots with infinite speed and agility.', 450, 9),

    -- Level 10 Items
    ('Legendary Helmet', 'Helmet', 'A legendary helmet with unparalleled protection.', 1000, 10),
    ('Eternal Breastplate', 'Breastplate', 'A breastplate that never ages.', 2000, 10),
    ('Excalibur', 'Weapon', 'The legendary sword of the kings.', 600, 10),
    ('Aegis Shield', 'Weapon', 'The ultimate shield with godly protection.', 540, 10),
    ('Celestial Boots', 'Boots', 'Boots that grant the power of the gods.', 500, 10);
    `;

    pool.query(SQL, (error, results, fields) => {
      if (error) {
        console.error("Error creating tables:", error);
      } else {
        console.log("Tables created successfully:", results);
      }
      process.exit();
    });
  }
});
