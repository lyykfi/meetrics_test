/**
 * Class AdvManagerResultRender.
 * An render for result to dom tree.
 */
class AdvManagerResultRender {
  /**
   * Constructor
   */
  constructor() {
    this.isVisibleId = "is_visible";
    this.visibleTimeId = "visible_time";
    this.percentOfVisibleId = "percent_of_visible";

    this.isVisibleElement = document.getElementById(this.isVisibleId);
    this.visibleTimeElement = document.getElementById(this.visibleTimeId);
    this.percentOfVisibleElement = document.getElementById(this.percentOfVisibleId);
  }

  /**
   * Render result.
   * @param {*} isVisible 
   * @param {*} visibleTime 
   * @param {*} percentOfVisible 
   */
  render(isVisible, visibleTime, percentOfVisible) {
    this.isVisibleElement.textContent = isVisible;
    this.visibleTimeElement.textContent = visibleTime;
    this.percentOfVisibleElement.textContent = percentOfVisible;
  }
}

/**
 * class AdvManager
 */
class AdvManager {
  /**
   * Constructor
   * @param {*} element 
   */
  constructor(element) {
    this.isViewable = true;
    this.viewabilityTime = 0;
    this.percentOfVisibility = 0;
    this.pageIsVisible = true;
    this.adElement = element;
    this.renderer = new AdvManagerResultRender();

    document.addEventListener(
      "visibilitychange", this.handleVisibilityChange.bind(this), false);

    setInterval(this.updateState.bind(this), 1000);
  }

  /**
   * React of change visibility state.
   */
  handleVisibilityChange() {
    this.pageIsVisible = !document.hidden;
  }

  /**
   * Update state adv.
   */
  updateState() {
    const rec = this.adElement.getBoundingClientRect();

    if (this.pageIsVisible) {
      const scrollTop = document.documentElement.scrollTop;
      const elementYPosition = rec.top + scrollTop;
      if ((rec.top > 0 &&
           scrollTop + window.innerHeight - rec.height >= elementYPosition) &&
           rec.left > 0) {
        this.viewabilityTime += 1;
        this.isViewable = true;
      } else {
        this.isViewable = false;

        if ((rec.top > 0 && scrollTop + window.innerHeight >= elementYPosition) ||
          (rec.top < 0 && Math.abs(rec.top) < rec.height)) {
          if (rec.top < 0) {
            this.percentOfVisibility = ((Math.abs(rec.height + rec.top) / rec.height) * 100).toFixed(1);
          } else {
            if (rec.height + rec.top > window.innerHeight) {
              const gap = (elementYPosition + rec.height) - (scrollTop + window.innerHeight);
              this.percentOfVisibility = (100 - (gap / rec.height) * 100).toFixed(1);
            } else {
              this.percentOfVisibility = 100;
            }
          }
        } else {
          this.percentOfVisibility = 0;
        }
      }
    } else {
      this.isViewable = false;
      this.percentOfVisibility = 0;
    }
  }

  /**
   * Keep changes.
   */
  follow() {
    setInterval(() => {
      this.renderer.render(this.isViewable, this.viewabilityTime, this.percentOfVisibility);
    }, 100);
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const advManager = new AdvManager(document.getElementById("ad"));
  advManager.follow();
});
