<template>
  <div id="app">
    <h1>Wallpaper Creator</h1>
    <p>Create a wallpaper for your phone out of any size image. Upload your image and then select two colors to create the gradient from.</p>
    <template v-if="imageUploaded">
      <p>Change gradient color</p>
      <div>
        <span>Inner color</span>
        <button @click="innerColorSelected = !innerColorSelected"  class="btn-toggle" :class="{toggled: !innerColorSelected}"></button>
        <span>Outer color</span>
      </div>
    </template>
    <div class="color-cards">
      <button v-for="(color, index) in colorPalette" :key="index" :style="`backgroundColor: ${color}`" class="card" @click="selectColor(color)"></button>
    </div>
    <div id="image-container">
      <div ref="top" class="gradient top"></div>
      <img id="display" ref="image" />
      <div ref="bottom" class="gradient bottom"></div>
    </div>
    <input type="file" accept="image/*" @change="displayImage" class="image-upload" />
    <template v-if="imageUploaded">
      <p>Done creating your new wallpaper?</p>
      <div class="saving-instructions">
        <p class="mobile-directions">On mobile it's easiest to display this as a new image and save directly to you photos - click here!</p>
        <p class="download-instructions">Or if you happen to want to download your new wallpaper as a jpeg you can click here!</p>
        <button @click="captureNewImage" class="mobile-btn">Display new wallpaper as image</button>
        <!-- <button @click="downloadImage" class="download-btn">Download image to desktop</button> -->
      </div>
      <div id="newWallpaper"/>
    </template>
  </div>
</template>

<script>
import domtoimage from 'dom-to-image';
import * as Vibrant from '../node_modules/node-vibrant/dist/vibrant';

export default {
  name: 'App',
  data() {
    return {
      colorPalette: [],
      palette: null,
      innerColor: null,
      outerColor: null,
      innerColorSelected: true,
      imageUploaded: false
    };
  },
  methods: {
    displayImage(e) {
      this.imageUploaded = true;
      const display = document.getElementById('display');
      const img = URL.createObjectURL(e.target.files[0]);
      display.src = img;
      const v = new Vibrant(img);
      v.getPalette((err, palette) => {
        this.palette = palette;
        this.colorPalette = Object.values(palette).map(color => color.getHex());
        this.innerColor = this.colorPalette[0];
        this.outerColor = this.colorPalette[2];
        this.applyGradient();
      });
    },
    applyGradient() {
      const iphoneScreenHeight = 896;
      const iphoneScreenWidth = 414;
      const iphoneAspectRatio = '19.5:9';
      const { image } = this.$refs;
      const imgWidth = image.clientWidth;
      const remainingHeight = (iphoneScreenHeight - image.clientHeight) / 2;
      const { top } = this.$refs;
      const { bottom } = this.$refs;
      top.setAttribute('style', `background: linear-gradient(${this.outerColor}, ${this.innerColor}); width: ${imgWidth}px; height: ${remainingHeight}px;`);
      bottom.setAttribute('style', `background: linear-gradient(${this.innerColor}, ${this.outerColor}); width: ${imgWidth}px; height: ${remainingHeight}px;`);
    },
    captureNewImage() {
      const imageNode = document.getElementById('image-container');
      domtoimage.toPng(imageNode)
        .then(dataUrl => {
          const img = new Image();
          img.src = dataUrl;
          document.body.appendChild(img);
        })
        .catch(error => {
          console.error('oops, something went wrong!', error);
        });
    },
    downloadImage() {
      domtoimage.toJpeg(document.getElementById('image-container'), { quality: 0.95 })
        .then(dataUrl => {
          const link = document.createElement('a');
          link.download = 'my-image-name.jpeg';
          link.href = dataUrl;
          link.click();
        })
        .catch(error => {
          console.error('oops, something went wrong!', error);
        });
    },
    selectColor(color) {
      if (this.innerColorSelected) {
        this.innerColor = color;
      } else this.outerColor = color;
    }
  },
  watch: {
    innerColor() {
      this.applyGradient();
    },
    outerColor() {
      this.applyGradient();
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
  margin-bottom: 60px;
}

.btn-toggle {
  height: 20px;
  width: 50px;
  border-radius: 10px;
  border: 1px solid gray;
  margin:0 10px;
  position: relative;
  &:before {
    content: '';
    height: 18px;
    position: absolute;
    width: 18px;
    background-color: slategray;
    left: 0;
    top: 0;
    border-radius: 10px;
  }
  &.toggled:before {
    transform: translate(30px);
  }
}

.color-cards {
  display: flex;
  justify-content: space-evenly;
  .card {
    height: 100px;
    width: 100px;
    border: 1px solid gray;
    border-radius: 5px;
    cursor: pointer;
  }
}

#image-container {
  margin: 60px 0 20px 0;
  img {
    max-height: 700px;
  }
  .gradient {
    margin: 0 auto;
    &.bottom {
      // TO DO: figure out why this is needed?
      margin-top: -6px;
    }
  }
}

.image-upload {
  display: block;
  margin: 0 auto;
}

#newWallpaper {
  img {
    max-height: 200px;
  }
}

.saving-instructions {
  display: grid;
  grid-template-columns: repeat(2, auto);
  button {
    width: fit-content;
    padding: 10px;
    border-radius: 5px;
    border: solid 1px slategray;
    font-family: inherit;
    font-weight: 500;
    margin: 0 auto;
  }
}

</style>
