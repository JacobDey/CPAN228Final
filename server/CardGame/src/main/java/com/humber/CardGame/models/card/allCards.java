// Just for convenience here's all the card text, this is a .java so Copilot can read it

/*

List of Cards
Red
Clumsy Dragon
Power: 5
Clumsy Dragon destroys itself at the beginning of your turn.

Hotheaded Loudmouth
Power: 3
On enter, blue cards here get -1. On death, blue cards here get +1.

Flame Belcher
Power: 1
On enter, destroy uncovered opposing blue card.

Savage Patriot
Power: 4
On enter, Savage Patriot destroys the card it’s covering if it is blue.

Magmatic Boxer
Power: 3
Blue
Icy Manipulator
Power: 4
On enter, red cards here get -1. On death, red cards here get +1.

Sacral Healer
Power: 2
On enter, your cards with power 2 or less here get +1.

Inspiring Squid
Power: 1
On enter, your cards here get +1.

Gentle Whale
Power: 5
On enter, Gentle Whale destroys itself if there is a red card here.

Tiger Shark
Power: 3
Yellow
Martyr’s Spirit
Power: 4
On enter, Martyr’s Spirit destroys the card it is covering.

Vengeful Force
Power: 0
When a card is destroyed, Vengeful Force gets +1

Golden Heart of Balance
Power: 5
When a card is destroyed, Golden Heart of Balance destroys itself.

East Wind
Power: 2
On enter, all cards here move right 1.

West Wind
Power: 3
On enter, all cards here move left 2.

Purple
Mad King
Power: 0
On enter, Mad King destroys every uncovered card.

Bloodthirsty Tactician
Power: 1
On enter, Bloodthirsty Tactician destroys the opposing uncovered card.
Green
Feeble Elder
Power: 0
On enter, draw 4 cards.

Studied Wizard
Power: 1
On enter, draw 2 cards.

Virile Apprentice
Power: 2
On enter, draw a card.
Orange
Lightning Bolt
Power: 0
On enter, opponent discards a random card.

Whirlwind Tornado
Power: 0
On enter, move opposing uncovered card here to the tower with the fewest cards.


White (All Colors)

Yaldabaoth
Power: 99
On enter, swap control of every card on the board, including Yaldabaoth.

And the cards as they exist in the database

[{
  "_id": {
    "$oid": "67e9d0c59a7f463f2f43aa8d"
  },
  "name": "Flame Belcher",
  "abilityText": "On enter, destroy opposing uncovered blue card.",
  "colour": "Red",
  "power": 1,
  "imageData": {
    "$binary": {
      "subType": "00"
    }
  },
  "imageType": "image/jpeg",
  "abilities": [
    {
      "abilityType": "ON_ENTER",
      "params": {
        "effect": "DESTROY_CARD",
        "target": "OPPOSING_UNCOVERED_BLUE"
      }
    }
  ],
  "_class": "com.humber.CardGame.models.card.Card"
},
{
  "_id": {
    "$oid": "67e9d0c59a7f463f2f43aa90"
  },
  "name": "Icy Manipulator",
  "abilityText": "On enter, red cards here get -1. On death, red cards here get +1.",
  "colour": "Blue",
  "power": 4,
  "imageData": {
    "$binary": {
      "subType": "00"
    }
  },
  "imageType": "image/jpeg",
  "abilities": [
    {
      "abilityType": "ON_ENTER",
      "params": {
        "effect": "POWER_CHANGE",
        "value": -1,
        "target": "RED_CARDS_HERE"
      }
    },
    {
      "abilityType": "ON_DEATH",
      "params": {
        "effect": "POWER_CHANGE",
        "value": 1,
        "target": "RED_CARDS_HERE"
      }
    }
  ],
  "_class": "com.humber.CardGame.models.card.Card"
},
{
  "_id": {
    "$oid": "67e9d0c59a7f463f2f43aa93"
  },
  "name": "Gentle Whale",
  "abilityText": "On enter, Gentle Whale destroys itself if there is a red card here.",
  "colour": "Blue",
  "power": 5,
  "imageData": {
    "$binary": {
      "subType": "00"
    }
  },
  "imageType": "image/jpeg",
  "abilities": [
    {
      "abilityType": "ON_ENTER",
      "params": {
        "targetColor": "RED",
        "effect": "DESTROY_SELF_IF_COLOR_HERE"
      }
    }
  ],
  "_class": "com.humber.CardGame.models.card.Card"
},
{
  "_id": {
    "$oid": "67e9d0c59a7f463f2f43aa8f"
  },
  "name": "Magmatic Boxer",
  "abilityText": "",
  "colour": "Red",
  "power": 3,
  "imageData": {
    "$binary": {
      "subType": "00"
    }
  },
  "imageType": "image/jpeg",
  "abilities": [],
  "_class": "com.humber.CardGame.models.card.Card"
},
{
  "_id": {
    "$oid": "67e9d0c59a7f463f2f43aa96"
  },
  "name": "Vengeful Force",
  "abilityText": "When a card is destroyed, Vengeful Force gets +1",
  "colour": "Yellow",
  "power": 0,
  "imageData": {
    "$binary": {
      "subType": "00"
    }
  },
  "imageType": "image/jpeg",
  "abilities": [
    {
      "abilityType": "ON_CARD_DESTROYED",
      "params": {
        "effect": "POWER_CHANGE",
        "value": 1,
        "target": "SELF"
      }
    }
  ],
  "_class": "com.humber.CardGame.models.card.Card"
},
{
  "_id": {
    "$oid": "67e9d0c59a7f463f2f43aa9f"
  },
  "name": "Lightning Bolt",
  "abilityText": "On enter, opponent discards a random card.",
  "colour": "Orange",
  "power": 3,
  "imageData": {
    "$binary": {
      "subType": "00"
    }
  },
  "imageType": "image/jpeg",
  "abilities": [
    {
      "abilityType": "ON_ENTER",
      "params": {
        "effect": "OPPONENT_DISCARD",
        "random": true,
        "count": 1
      }
    }
  ],
  "_class": "com.humber.CardGame.models.card.Card"
},
{
  "_id": {
    "$oid": "67e9d0c59a7f463f2f43aaa0"
  },
  "name": "Whirlwind Tornado",
  "abilityText": "On enter, move opposing uncovered card here to the tower with the fewest cards.",
  "colour": "Orange",
  "power": 2,
  "imageData": {
    "$binary": {
      "subType": "00"
    }
  },
  "imageType": "image/jpeg",
  "abilities": [
    {
      "abilityType": "ON_ENTER",
      "params": {
        "effect": "MOVE_CARD",
        "destination": "TOWER_WITH_FEWEST_CARDS",
        "target": "OPPOSING_UNCOVERED_CARD"
      }
    }
  ],
  "_class": "com.humber.CardGame.models.card.Card"
},
{
  "_id": {
    "$oid": "67e9d0c59a7f463f2f43aaa1"
  },
  "name": "Yaldabaoth",
  "abilityText": "On enter, swap control of every card on the board, including Yaldabaoth.",
  "colour": "White",
  "power": 3,
  "imageData": {
    "$binary": {
      "subType": "00"
    }
  },
  "imageType": "image/jpeg",
  "abilities": [
    {
      "abilityType": "ON_ENTER",
      "params": {
        "target": "ALL_CARDS",
        "effect": "SWAP_CONTROL"
      }
    }
  ],
  "_class": "com.humber.CardGame.models.card.Card"
},
{
  "_id": {
    "$oid": "67e9d0c59a7f463f2f43aa8c"
  },
  "name": "Hotheaded Loudmouth",
  "abilityText": "On enter, blue cards here get -1. On death, blue cards here get +1.",
  "colour": "Red",
  "power": 3,
  "imageData": {
    "$binary": {
      "subType": "00"
    }
  },
  "imageType": "image/png",
  "abilities": [
    {
      "abilityType": "ON_ENTER",
      "params": {
        "effect": "POWER_CHANGE",
        "value": -1,
        "target": "BLUE_CARDS_HERE"
      }
    },
    {
      "abilityType": "ON_DEATH",
      "params": {
        "effect": "POWER_CHANGE",
        "value": 1,
        "target": "BLUE_CARDS_HERE"
      }
    }
  ],
  "_class": "com.humber.CardGame.models.card.Card"
},
{
  "_id": {
    "$oid": "67e9d0c59a7f463f2f43aa95"
  },
  "name": "Martyr’s Spirit",
  "colour": "Yellow",
  "power": 4,
  "imageData": {
    "$binary": {
      "subType": "00"
    }
  },
  "imageType": "image/jpeg",
  "abilities": [],
  "_class": "com.humber.CardGame.models.card.Card"
},
{
  "_id": {
    "$oid": "67e9d0c59a7f463f2f43aa97"
  },
  "name": "Golden Heart of Balance",
  "abilityText": "When a card is destroyed, Golden Heart of Balance destroys itself.",
  "colour": "Yellow",
  "power": 5,
  "imageData": {
    "$binary": {
      "subType": "00"
    }
  },
  "imageType": "image/jpeg",
  "abilities": [
    {
      "abilityType": "ON_CARD_DESTROYED",
      "params": {
        "effect": "DESTROY_SELF"
      }
    }
  ],
  "_class": "com.humber.CardGame.models.card.Card"
},
{
  "_id": {
    "$oid": "67e9d0c59a7f463f2f43aa98"
  },
  "name": "East Wind",
  "abilityText": "On enter, all cards here move right 1.",
  "colour": "Yellow",
  "power": 2,
  "imageData": {
    "$binary": {
      "subType": "00"
    }
  },
  "imageType": "image/jpeg",
  "abilities": [
    {
      "abilityType": "ON_ENTER",
      "params": {
        "effect": "MOVE_CARDS",
        "direction": "RIGHT",
        "distance": 1,
        "target": "ALL_CARDS_HERE"
      }
    }
  ],
  "_class": "com.humber.CardGame.models.card.Card"
},
{
  "_id": {
    "$oid": "67e9d0c59a7f463f2f43aa9b"
  },
  "name": "Bloodthirsty Tactician",
  "abilityText": "On enter, Bloodthirsty Tactician destroys the opposing uncovered card.",
  "colour": "Purple",
  "power": 1,
  "imageData": {
    "$binary": {
      "subType": "00"
    }
  },
  "imageType": "image/jpeg",
  "abilities": [
    {
      "abilityType": "ON_ENTER",
      "params": {
        "target": "OPPOSING_UNCOVERED_CARD",
        "effect": "DESTROY_CARD"
      }
    }
  ],
  "_class": "com.humber.CardGame.models.card.Card"
},
{
  "_id": {
    "$oid": "67e9d0c59a7f463f2f43aa9c"
  },
  "name": "Feeble Elder",
  "abilityText": "On enter, draw 4 cards.",
  "colour": "Green",
  "power": 0,
  "imageData": {
    "$binary": {
      "subType": "00"
    }
  },
  "imageType": "image/jpeg",
  "abilities": [
    {
      "abilityType": "ON_ENTER",
      "params": {
        "count": 4,
        "effect": "DRAW_CARDS"
      }
    }
  ],
  "_class": "com.humber.CardGame.models.card.Card"
},
{
  "_id": {
    "$oid": "67e9d0c59a7f463f2f43aa9d"
  },
  "name": "Studied Wizard",
  "abilityText": "On enter, draw 2 cards.",
  "colour": "Green",
  "power": 1,
  "imageData": {
    "$binary": {
      "subType": "00"
    }
  },
  "imageType": "image/jpeg",
  "abilities": [
    {
      "abilityType": "ON_ENTER",
      "params": {
        "count": 2,
        "effect": "DRAW_CARDS"
      }
    }
  ],
  "_class": "com.humber.CardGame.models.card.Card"
},
{
  "_id": {
    "$oid": "67e9d0c59a7f463f2f43aa8b"
  },
  "name": "Clumsy Dragon",
  "abilityText": "Destroys itself at the beginning of your turn.",
  "colour": "Red",
  "power": 5,
  "imageData": {
    "$binary": {
      "subType": "00"
    }
  },
  "imageType": "image/jpeg",
  "abilities": [
    {
      "abilityType": "TURN_START",
      "params": {
        "effect": "DESTROY_SELF_IF_OWNERS_TURN"
      }
    }
  ],
  "_class": "com.humber.CardGame.models.card.Card"
},
{
  "_id": {
    "$oid": "67e9d0c59a7f463f2f43aa8e"
  },
  "name": "Savage Patriot",
  "abilityText": "On enter, Savage Patriot destroys the card it's covering if it is blue.",
  "colour": "Red",
  "power": 4,
  "imageData": {
    "$binary": {
      "subType": "00"
    }
  },
  "imageType": "image/jpeg",
  "abilities": [
    {
      "abilityType": "ON_ENTER",
      "params": {
        "targetColor": "BLUE",
        "effect": "DESTROY_IF_COLOR",
        "target": "CARD_BELOW"
      }
    }
  ],
  "_class": "com.humber.CardGame.models.card.Card"
},
{
  "_id": {
    "$oid": "67e9d0c59a7f463f2f43aa91"
  },
  "name": "Sacral Healer",
  "abilityText": "On enter, your cards with power 2 or less here get +1.",
  "colour": "Blue",
  "power": 2,
  "imageData": {
    "$binary": {
      "subType": "00"
    }
  },
  "imageType": "image/jpeg",
  "abilities": [
    {
      "abilityType": "ON_ENTER",
      "params": {
        "effect": "POWER_CHANGE",
        "powerThreshold": 2,
        "value": 1,
        "target": "YOUR_CARDS_HERE_WITH_POWER_LESS_THAN"
      }
    }
  ],
  "_class": "com.humber.CardGame.models.card.Card"
},
{
  "_id": {
    "$oid": "67e9d0c59a7f463f2f43aa92"
  },
  "name": "Inspiring Squid",
  "abilityText": "On enter, your cards here get +1.",
  "colour": "Blue",
  "power": 1,
  "imageData": {
    "$binary": {
      "subType": "00"
    }
  },
  "imageType": "image/jpeg",
  "abilities": [
    {
      "abilityType": "ON_ENTER",
      "params": {
        "effect": "POWER_CHANGE",
        "value": 1,
        "target": "YOUR_CARDS_HERE"
      }
    }
  ],
  "_class": "com.humber.CardGame.models.card.Card"
},
{
  "_id": {
    "$oid": "67e9d0c59a7f463f2f43aa94"
  },
  "name": "Tiger Shark",
  "abilityText": "",
  "colour": "Blue",
  "power": 3,
  "imageData": {
    "$binary": {
      "subType": "00"
    }
  },
  "imageType": "image/jpeg",
  "abilities": [],
  "_class": "com.humber.CardGame.models.card.Card"
},
{
  "_id": {
    "$oid": "67e9d0c59a7f463f2f43aa99"
  },
  "name": "West Wind",
  "abilityText": "On enter, all cards here move left 2.",
  "colour": "Yellow",
  "power": 3,
  "imageData": {
    "$binary": {
      "subType": "00"
    }
  },
  "imageType": "image/jpeg",
  "abilities": [
    {
      "abilityType": "ON_ENTER",
      "params": {
        "effect": "MOVE_CARDS",
        "direction": "LEFT",
        "distance": 2,
        "target": "ALL_CARDS_HERE"
      }
    }
  ],
  "_class": "com.humber.CardGame.models.card.Card"
},
{
  "_id": {
    "$oid": "67e9d0c59a7f463f2f43aa9a"
  },
  "name": "Mad King",
  "abilityText": "On enter, Mad King destroys every uncovered card.",
  "colour": "Purple",
  "power": 0,
  "imageData": {
    "$binary": {
      "subType": "00"
    }
  },
  "imageType": "image/jpeg",
  "abilities": [
    {
      "abilityType": "ON_ENTER",
      "params": {
        "target": "ALL_UNCOVERED_CARDS",
        "effect": "DESTROY_CARDS"
      }
    }
  ],
  "_class": "com.humber.CardGame.models.card.Card"
},
{
  "_id": {
    "$oid": "67e9d0c59a7f463f2f43aa9e"
  },
  "name": "Virile Apprentice",
  "abilityText": "On enter, draw a card.",
  "colour": "Green",
  "power": 2,
  "imageData": {
    "$binary": {
      "subType": "00"
    }
  },
  "imageType": "image/jpeg",
  "abilities": [
    {
      "abilityType": "ON_ENTER",
      "params": {
        "count": 1,
        "effect": "DRAW_CARDS"
      }
    }
  ],
  "_class": "com.humber.CardGame.models.card.Card"
}]
   */