<template>
  <div id="app">
    <div class="color-cards">
      <div v-for="(color, index) in colorPalette" :key="index" :style="`backgroundColor: ${color}`" class="card"></div>
    </div>
    <input type="file" accept="image/*" id="input" @change="displayImage" />
    <div id="image-container">
      <div ref="top" class="gradient top"></div>
      <img id="display" ref="image" />
      <div ref="bottom" class="gradient bottom"></div>
    </div>
  </div>
</template>

<script>
import htmlToImage from 'html-to-image';
import * as Vibrant from '../node_modules/node-vibrant/dist/vibrant';

export default {
  name: 'App',
  data() {
    return {
      colorPalette: [],
      palette: null
    };
  },
  methods: {
    displayImage(e) {
      const display = document.getElementById('display');
      const img = URL.createObjectURL(e.target.files[0]);
      display.src = img;
      const v = new Vibrant(img);
      v.getPalette((err, palette) => {
        this.palette = palette;
        this.colorPalette = Object.values(palette).map((color) => color.getHex());
        this.applyGradient();
        this.captureNewImage();
      });
    },
    applyGradient() {
      const screenHeight = 1792;
      const screenWidth = 828;
      const aspectRatio = '19.5:9';
      const { image } = this.$refs;
      const imgWidth = image.clientWidth;
      const remainingHeight = (screenHeight - image.clientHeight) / 2;
      const { top } = this.$refs;
      const { bottom } = this.$refs;
      top.setAttribute('style', `background: linear-gradient(${this.colorPalette[2]}, ${this.colorPalette[0]}); width: ${imgWidth}px; height: ${remainingHeight}px;`);
      bottom.setAttribute('style', `background: linear-gradient(${this.colorPalette[0]}, ${this.colorPalette[2]}); width: ${imgWidth}px; height: ${remainingHeight}px;`);
    },
    captureNewImage() {
      htmlToImage.toJpeg(document.getElementById('image-container'), { quality: 0.95 })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = 'wallpaper.jpeg';
          link.href = dataUrl;
          link.click();
        });
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

img {
  max-height: 400px;
}

.color-cards {
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 10px;
  .card {
    height: 100px;
    width: 100px;
    border-radius: 5px;
  }
}

input {
  margin-bottom: 20px;
}

.gradient {
  margin: 0 auto;
  &.bottom {
    margin-top: -10px;
  }
}
</style>
