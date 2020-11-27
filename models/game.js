class Game {
    constructor(id, ownerId, name, description, gameoverMessage, isOpen) {
      this.id = id;
      this.ownerId = ownerId;
      this.name = name;
      this.description = description;
      this.gameoverMessage = gameoverMessage;
      this.isOpen = isOpen;
    }
  }
  
  export default Game;
  