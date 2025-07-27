(() => {
    const SLIDER_TRAY_SELECTOR = '.carousel__slider-tray';
    const SLIDE_WIDTH = 232;
  const init = async () => {

    buildHTML();
    buildCSS();
    setEvents();

    const products = await fetchProducts();
    renderCarousel(products);
    observeFavoriteState(); 
  };

  const buildHTML = () => {
    const target = document.querySelector('.product-detail');
    if (!target) return; 

    const clearfix = document.querySelector('.clearfix');
    if (!clearfix || !clearfix.classList.contains('clearfix')) {
        console.warn("❌ .clearfix bulunamadı. HTML eklenemedi.");
        return;
    }

    const html = `
        <div id="you-may-like" bis_skin_checked="1">
            <div id="you-may-like-recommendations" bis_skin_checked="1">
                    <div class="recommendation-carousel" bis_skin_checked="1">
                        <div class="carousel-container" bis_skin_checked="1">
                            <p class="you-may-like-title">Bunları da Beğenebilirsin</p>
                            <div class="carousel padded-carousel padded-carousel__unbrand-responsive" bis_skin_checked="1">
                                <button type="button" aria-label="previous" class="buttonBack___1mlaL carousel__back-button carousel-arrow carousel-arrow-left">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242">
                                        <path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path>
                                    </svg>
                                </button>
                                <div class="horizontalSlider___281Ls carousel__slider carousel__slider--horizontal" aria-live="polite" aria-label="slider" role="listbox" bis_skin_checked="1">
                                    <div class="carousel__slider-tray-wrapper carousel__slider-tray-wrap--horizontal" bis_skin_checked="1">
                                        <div class="sliderTray___-vHFQ sliderAnimation___300FY carousel__slider-tray carousel__slider-tray--horizontal" bis_skin_checked="1" style="display: flex; align-items: stretch; width: 535.714%; transform: translateX(0%) translateX(0px); flex-direction: row;"></div>
                                    </div>
                                </div>
                                <button type="button" aria-label="next" class="buttonNext___2mOCa carousel__next-button carousel-arrow carousel-arrow-right rotate-180">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242">
                                        <path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    `;

    $(clearfix).after(html);
  };

    const buildCSS = () => {
        const css = `

            #you-may-like-recommendations {
                background-color: #faf9f7;
                position: relative;
            }

            @media (max-width: 990px) {
                #you-may-like .new-product-card__information-box__add-to-cart {
                    display: flex !important;
                }
            }

            @media (min-width: 991px) {
                #you-may-like .new-product-card__information-box__add-to-cart {
                    display: none !important;
                }
            }

            .you-may-like-title {
                font-size: 24px;
                color: #29323b;
                line-height: 33px;
                font-weight: lighter;
                padding: 15px 0;
                margin: 0;
            }

            @media (min-width: 992px) {
                .recommendation-carousel .you-may-like-title {
                    font-size: 32px;
                    line-height: 43px;
                }
            }

            @media (min-width: 992px) {
                .recommendation-carousel {
                    display: flex;
                    justify-content: center;
                    padding: 0px !important;
                }
            }

            @media (min-width: 992px) {
                .recommendation-carousel .carousel-container {
                    display: block;
                    width: 80%;
                }
            }

            @media (min-width: 992px) {
                .recommendation-carousel .carousel-container {
                    display: block;
                    width: 80%;
                    position: relative;
                }
            }

            @media (min-width: 992px) {
                .recommendation-carousel .carousel-container {
                    display: block;
                    width: 80%;
                }
            }

            @media (min-width: 992px) {
                .recommendation-carousel .carousel-container {
                    display: block;
                    width: 80%;
                }
            }

            .padded-carousel {
                padding-bottom: 32px;
            }

            .carousel {
                position: relative;
            }
                
            .new-product-card__image-wrapper .favorite-option {
                position: absolute;
                top: 6%;
                right: 10%;
            }

            .favorite-option--liked svg {
                height: 18px; 
            }
            
        `;

        $('<style>').addClass('carousel-style').html(css).appendTo('head');
    };


  const setEvents = () => {

    const getCurrentTranslateX = () => {
        const style = getComputedStyle(document.querySelector(SLIDER_TRAY_SELECTOR)).transform;
        const matrix = new DOMMatrixReadOnly(style);
        return matrix.m41;
    };
    const setTranslateX = (value) => {
        document.querySelector(SLIDER_TRAY_SELECTOR).style.transform = `translateX(${value}px)`;
    };
    const getMaxTranslate = () => {
        const tray = document.querySelector(SLIDER_TRAY_SELECTOR);
        const total = tray.children.length;
        const visibleCount = Math.floor(tray.parentElement.offsetWidth / SLIDE_WIDTH);
        return -(SLIDE_WIDTH * (total - visibleCount));
    };

    document.querySelector('.carousel-arrow-left').addEventListener('click', () => {
        const x = getCurrentTranslateX();
        if (x < 0) {        
        setTranslateX(Math.min(x + SLIDE_WIDTH, 0));
        updateArrowStates();
        }
    });

    document.querySelector('.carousel-arrow-right').addEventListener('click', () => {
        const x = getCurrentTranslateX();
        const max = getMaxTranslate();
        if (x > max) {   
        setTranslateX(Math.max(x - SLIDE_WIDTH, max));
        updateArrowStates();
        }
    });

    $('.favorite-option').on('click', function() {
        console.log("❤️ Favori ikonu tıklandı.");
        $(this).toggleClass('favorite-option--liked');
    });
   

    const toggleCartButtons = () => {
        const visible = window.innerWidth < 990;
        $('#you-may-like .new-product-card__information-box__add-to-cart').css('display', visible ? 'flex' : 'none');

    };

    const updateArrowStates = () => {
        const tray = document.querySelector(SLIDER_TRAY_SELECTOR);
        const currentX = getCurrentTranslateX();
        const totalSlides = tray.children.length;
        const maxTranslate = -(SLIDE_WIDTH * (totalSlides - Math.floor(tray.parentElement.offsetWidth / SLIDE_WIDTH)));

        document.querySelector('.carousel-arrow-left').disabled = currentX >= 0;
        document.querySelector('.carousel-arrow-right').disabled = currentX <= maxTranslate;
    };

    const toggleCarouselClass = () => {
        const $carousel = $('#you-may-like-recommendations .recommendation-carousel > .carousel');
        if (window.innerWidth < 990) {
            $carousel.addClass('padded-carousel__unbrand-responsive');
        } else {
            $carousel.removeClass('padded-carousel__unbrand-responsive');
        }
    };

    window.addEventListener('resize', () => {
        toggleCartButtons();
        toggleCarouselClass();
    });
    toggleCartButtons();
    toggleCarouselClass();


  };

  const fetchProducts = async () => {
    const localData = localStorage.getItem('productList');

    if (localData) {
      try {
        console.log("✅ LocalStorage'dan veri alındı.");
        return JSON.parse(localData);
      } catch (error) {
        console.error('❌ LocalStorage parse hatası:', error);
      }
    }

    try {
      const response = await fetch('https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json');
      const data = await response.json();
      localStorage.setItem('productList', JSON.stringify(data));
        console.log("✅ API'den veri alındı ve LocalStorage'a kaydedildi.");
      return data;
    } catch (error) {
      console.error("❌ API'den veri alınamadı:", error);
      return [];
    }
  };

    const renderCarousel = (products) => {
        const favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];

        products.forEach(product => {
            const isFavorite = favoriteProducts.includes(product.name);
            const likedClass = isFavorite ? 'favorite-option--liked' : '';
            const svgFill = isFavorite ? '#193DB0' : '#fff';
            const svgStroke = isFavorite ? 'none' : '#B6B7B9';
            const svgHeight = isFavorite ? '18' : '20';
            
            const html = `
            <div aria-selected="false" aria-label="slide" role="option" class="slide___3-Nqo slideHorizontal___1NzNV carousel__slide carousel__slide--hidden custom-carousel__slide" bis_skin_checked="1">
                <div class="slideInner___2mfX9 carousel__inner-slide" bis_skin_checked="1" style="position: unset;">
                    <div class="new-product-card">
                        <div class="new-product-card__image-wrapper">
                            <a href="${product.img}">
                                <span class=" lazy-load-image-background  lazy-load-image-loaded" style="color: transparent; display: inline-block;"> 
                                    <img src="${product.img}" alt="${product.name}" class="product-image ls-is-cached lazyloaded"/>
                                </span>
                            </a>
                            <div class="favorite-option ${likedClass}" bis_skin_checked="1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="${svgHeight}" fill="none">
                                    <path fill="${svgFill}" fill-rule="evenodd" stroke="${svgStroke}" 
                                    d="M19.97 6.449c-.277-3.041-2.429-5.247-5.123-5.247-1.794 0-3.437.965-4.362 2.513C9.57 2.147 7.993 1.2 6.228 1.2c-2.694 0-4.846 2.206-5.122 5.247-.022.135-.112.841.16 1.994.393 1.663 1.3 3.175 2.621 4.373l6.594 5.984 6.707-5.984c1.322-1.198 2.228-2.71 2.62-4.373.273-1.152.183-1.86.162-1.993z"
                                    clip-rule="evenodd">
                                    </path>
                                </svg> 
                            </div>
                        </div>
                        <div class="new-product-card__information-box" bis_skin_checked="1">
                            <div class="new-product-card__information-box__title" bis_skin_checked="1">
                                <a href="${product.url}">
                                    <p class="product-name">${product.name}</p>
                                </a>
                            </div>
                            <div class="new-product-card__price" bis_skin_checked="1">
                                <div class="price__current-price" bis_skin_checked="1">
                                        ${product.price} TL
                                </div>
                            </div>
                            <div class="new-product-card__information-box__add-to-cart" bis_skin_checked="1">
                                <button class="product-add-to-cart ">SEPETE EKLE</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        $('.carousel__slider-tray').append(html);
        });
        setTimeout(observeFavoriteState, 0);
    };

  const waitForElement = (selector, callback) => {
    if (document.querySelector(selector)) return callback();

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        callback();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  };

  waitForElement('.product-detail', () => {
    console.log("🎯 .product-detail bulundu, init başlatılıyor...");
    if (!window.jQuery) {
      const script = document.createElement('script');
      script.src = "https://code.jquery.com/jquery-3.7.1.min.js";
      script.onload = () => init();
      document.head.appendChild(script);
    } else {
      init();
    }
  });

      const observeFavoriteState = () => {
        const targetNodes = document.querySelectorAll('.favorite-option');

        targetNodes.forEach(node => {
            const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.attributeName === 'class') {
                const $el = $(mutation.target);
                const isLiked = $el.hasClass('favorite-option--liked');
                const $svg = $el.find('svg');
                const $path = $svg.find('path');
                const productName = $el.closest('.new-product-card').find('.product-name').text();
                let favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];

                if (isLiked) {
                    if (!favoriteProducts.includes(productName)) {
                    favoriteProducts.push(productName);
                    localStorage.setItem('favoriteProducts', JSON.stringify(favoriteProducts));
                    }
                    console.log("💙 Favoriye eklendi:", productName);
                    $svg.attr('height', '18');
                    $path.attr('fill', '#193DB0');
                    $path.removeAttr('stroke');
                } else {
                    const index = favoriteProducts.indexOf(productName);
                    if (index > -1) {
                    favoriteProducts.splice(index, 1);
                    localStorage.setItem('favoriteProducts', JSON.stringify(favoriteProducts));
                    }
                    console.log("🤍 Favoriden çıkarıldı:", productName);
                    $svg.attr('height', '20');
                    $path.attr('fill', '#fff');
                    $path.attr('stroke', '#B6B7B9');
                }
                }
            });
            });

            observer.observe(node, { attributes: true });
        });
    };

    $(document).on('click', '.favorite-option', function () {
        $(this).toggleClass('favorite-option--liked');
    });


    
})();
