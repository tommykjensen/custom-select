class Select extends HTMLElement {
  constructor() {
    super();
    this.options = [];
    this.isOpen = false;
    this._selectedItem = "hhh";

    this.attachShadow({ mode: "open" });
    this.isOpen = false;
    this.shadowRoot.innerHTML = `

    <style>
      #backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: rgba(0, 0, 0, 0.0);
        z-index: 10;
        opacity: 0;
        pointer-events: none;
      }
    
      :host([opened]) #backdrop {
        opacity: 1;
        pointer-events: all;
      }
    
      .custom-select-wrapper {
        position: relative;
        user-select: none;
        width: 100%;
        z-index: 20;
      }
    
      .custom-select {
        position: relative;
        display: flex;
        flex-direction: column;
        border-width: 0 2px 0 2px;
        border-style: solid;
        border-color: #394a6d;
        z-index: 20;
      }
    
      .custom-select__trigger {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 22px;
        font-size: 20px;
        font-weight: 300;
        color: #3b3b3b;
        height: 60px;
        line-height: 60px;
        background: #ffffff;
        cursor: pointer;
        border-width: 2px 0 2px 0;
        border-style: solid;
        border-color: #394a6d;
      }
    
      .custom-options {
        position: absolute;
        display: block;
        top: 100%;
        left: 0;
        right: 0;
        border: 2px solid #394a6d;
        border-top: 0;
        background: #fff;
        transition: all 0.5s;
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        z-index: 2;
      }
    
      .custom-select.open .custom-options {
        opacity: 1;
        visibility: visible;
        pointer-events: all;
      }
    
      .custom-option {
        position: relative;
        display: block;
        padding: 0 22px 0 22px;
        font-size: 22px;
        font-weight: 300;
        color: #3b3b3b;
        line-height: 60px;
        cursor: pointer;
        transition: all 0.5s;
      }
    
      .custom-option:hover {
        cursor: pointer;
        background-color: #b2b2b2;
      }
    
      .custom-option.selected {
        color: #ffffff;
        background-color: #305c91;
      }
    
      .arrow {
        position: relative;
        height: 15px;
        width: 15px;
      }
    
      .arrow::before,
      .arrow::after {
        content: "";
        position: absolute;
        bottom: 0px;
        width: 0.15rem;
        height: 100%;
        transition: all 0.5s;
      }
    
      .arrow::before {
        left: -5px;
        transform: rotate(45deg);
        background-color: #394a6d;
      }
    
      .arrow::after {
        left: 5px;
        transform: rotate(-45deg);
        background-color: #394a6d;
      }
    
      .open .arrow::before {
        left: -5px;
        transform: rotate(-45deg);
      }
    
      .open .arrow::after {
        left: 5px;
        transform: rotate(45deg);
      }
    </style>
    <div id="backdrop"></div>
    <div class="custom-select-wrapper">
    
      <div class="custom-select">
        <div class="custom-select__trigger"><span>Choose</span>
          <div class="arrow"></div>
        </div>
        <div class="custom-options">
          <span class="custom-option" data-value="volvo">Volvo</span>
        </div>
      </div>
    </div>

    `;

    this.shadowRoot
      .querySelector(".custom-select-wrapper")
      .addEventListener("click", function () {
        this.querySelector(".custom-select").classList.toggle("open");
        const backdrop = this.parentNode.querySelector("#backdrop");
        if (this.querySelector(".custom-select.open")) {
          backdrop.style.opacity = 1;
          backdrop.style.pointerEvents = "all";
        } else {
          backdrop.style.opacity = 0;
          backdrop.style.pointerEvents = "none";
        }
      });
    const backdrop = this.shadowRoot.querySelector("#backdrop");
    backdrop.addEventListener("click", this._cancel.bind(this));
    this.shadowRoot.addEventListener("keyup", function (event) {
      console.log(event);
    });
  }

  _cancel(event) {
    this.shadowRoot.querySelector(".custom-select").classList.toggle("open");
    const backdrop = this.shadowRoot.querySelector("#backdrop");
    backdrop.style.opacity = 0;
    backdrop.style.pointerEvents = "none";
    const cancelEvent = new Event("cancel", { bubbles: true, composed: true });
    event.target.dispatchEvent(cancelEvent);
  }

  set setOptions(options) {
    this.options = options;
    const element = this.shadowRoot.querySelector(".custom-options");
    element.textContent = "";
    for (const o of options) {
      let wrapper = document.createElement("span");
      wrapper.setAttribute("class", "custom-option");
      wrapper.setAttribute("data-value", o.value);
      wrapper.setAttribute("data-label", o.label);
      wrapper.textContent = o.label;

      for (const option of this.shadowRoot.querySelectorAll(".custom-option")) {
        option.addEventListener('click', function(event) {
            if (!this.classList.contains('selected')) {
                if (this.parentNode.querySelector('.custom-option.selected')) {
                  this.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
                }
                this.classList.add('selected');
                this.closest('.custom-select').querySelector('.custom-select__trigger span').textContent = this.textContent;
                const selectedEvent = new CustomEvent("selecteditem", {
                  bubbles: true,
                  composed: true,
                  detail: this.dataset,
                });
                event.target.dispatchEvent(selectedEvent);
                const backdrop = this.parentNode.parentNode.parentNode.parentNode.querySelector(
                  "#backdrop"
                );
                backdrop.style.opacity = 0;
                backdrop.style.pointerEvents = "none";
            }
        })
      }

      // wrapper.addEventListener("click", function (event) {
      //   console.log(this.dataset);
      //   if (!this.classList.contains("selected")) {
      //     this.classList.add("selected");
      //     this.closest(".custom-select").querySelector(
      //       ".custom-select__trigger span"
      //     ).textContent = this.textContent;
      //     const selectedEvent = new CustomEvent("selecteditem", {
      //       bubbles: true,
      //       composed: true,
      //       detail: this.dataset,
      //     });
      //     event.target.dispatchEvent(selectedEvent);
      //     const backdrop = this.parentNode.parentNode.parentNode.parentNode.querySelector(
      //       "#backdrop"
      //     );
      //     backdrop.style.opacity = 0;
      //     backdrop.style.pointerEvents = "none";
      //   }
      // });

      element.appendChild(wrapper);
    }
  }
}

customElements.define("my-select", Select);
