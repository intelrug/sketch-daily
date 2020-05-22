export default class Utils {
  public static shuffle(array: any[]) {
    const arrayCopy = Array.from(array);
    let currentIndex = arrayCopy.length;
    let temporaryValue;
    let randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = arrayCopy[currentIndex];
      arrayCopy[currentIndex] = arrayCopy[randomIndex];
      arrayCopy[randomIndex] = temporaryValue;
    }

    return arrayCopy;
  }
}
