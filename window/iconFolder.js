class IconManager {
  constructor(fileSystem) {
    this.fileSystem = fileSystem;
    this.iconImages = {};
    this.iconSize = 52;
    this.padding = 30;
    this.currentPath = '';
    this.desktopIcons = [];
    this.loadIcons();
  }

  loadIcons() {
    this.iconImages = {
      [FileType.FOLDER]: loadImage('assets/images/icons/folder.png'),
      [FileType.TEXT]: loadImage('assets/images/icons/text-file.png'),
      [FileType.IMAGE]: loadImage('assets/images/icons/image-file.png'),
      [FileType.VIDEO]: loadImage('assets/images/icons/video-file.png'),
      [FileType.DOCUMENT]: loadImage('assets/images/icons/document.png')
    };
  }

  createIcon(x, y, item) {
    return {
      x, y,
      item,
      width: this.iconSize,
      height: this.iconSize,
      label: item.name,
    };
  }

  layoutIcons(path = '') {
    this.currentPath = path;
    const items = this.fileSystem.listItems(path);
    this.desktopIcons = [];
    let currentX = 20;
    let currentY = 20;
    const maxX = width - this.iconSize;
    
    Object.values(items).forEach(item => {
      if (currentX + this.iconSize > maxX) {
        currentX = 20;
        currentY += this.iconSize + this.padding;
      }
      
      this.desktopIcons.push(this.createIcon(100 + currentX, CUSTOMER_SECTION_HEIGHT + 50 + currentY, item));
      currentX += this.iconSize + this.padding;
    });
  }

  display() {
    this.desktopIcons.forEach(icon => {
      const iconImg = this.iconImages[icon.item.type] || this.iconImages[FileType.TEXT];
      
      image(iconImg, icon.x, icon.y, icon.width, icon.height);
      
      fill(255);
      noStroke();
      textAlign(CENTER);
      textSize(12);
      text(icon.label, icon.x + icon.width/2, icon.y + icon.height + 15);
    });
  }

  handleClick(mx, my) {
    for (const icon of this.desktopIcons) {
      if (mx > icon.x && mx < icon.x + icon.width &&
          my > icon.y && my < icon.y + icon.height) {
        return icon.item;
      }
    }
    return null;
  }
}
