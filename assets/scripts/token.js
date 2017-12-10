'use strict';

var oldStage = '';
// start of auction
var startDay = new Date('Dec 5, 2017 17:34:20').getTime();
// end of auction
var endDay = new Date('Oct 29, 2018 17:34:45').getTime();

// Auction price decay function; returns price at timestamp
function getPrice(priceStart, priceConstant, priceExponent, elapsedSeconds) {
  var decayRate = Math.floor(Math.pow(elapsedSeconds, priceExponent) / priceConstant);
  var price = Math.floor(priceStart * (1 + elapsedSeconds) / (1 + elapsedSeconds + decayRate));
  return price;
}

function getCurrentPrice(priceStart, priceConstant, priceExponent, elapsedSeconds) {
  var decayRate = Math.pow(elapsedSeconds, priceExponent) / priceConstant;
  var price = priceStart * (1 + elapsedSeconds) / (1 + elapsedSeconds + decayRate);
  return price;
}

// Funding target; returns auction funds expected at price (WEI or ETH / RDN)
function fundingTarget(price, tokensOffered) {
  return price * tokensOffered;
}

function updateCurrentValues(obj) {
  if ($('#price').is(':visible')) {
    return;
  }
  if (obj['current-price'] !== undefined) {
    val = obj['current-price'].toLocaleString('en', { minimumFractionDigits: 7, maximumFractionDigits: 7 });
    $('.current-price').text(val);
  }
  if (obj['current-target'] !== undefined) {
    var val = obj['current-target'].toLocaleString('en', { maximumFractionDigits: 0 });
    $('.current-target').text(val);
  }
  if (obj['current-total'] !== undefined) {
    var val = obj['current-total'].toLocaleString('en', { maximumFractionDigits: 0 });
    $('.current-total').text(val);
  }
  if (obj['total-issued'] !== undefined) {
    var val = obj['total-issued'].toLocaleString('en', { maximumFractionDigits: 0 });
    $('.total-issued').text(val);
  }
  if (obj['amount-raised'] !== undefined) {
    var val = obj['amount-raised'].toLocaleString('en', { maximumFractionDigits: 0 });
    $('.amount-raised').text(val);
  }
  if (obj['current-target'] !== undefined && obj['amount-raised'] !== undefined) {
    var val = (obj['current-target'] - obj['amount-raised']).toLocaleString('en', { maximumFractionDigits: 0 });
    $('.current-missing').text(val);
  }
  if (obj['current-end'] !== undefined) {
    var val = obj['current-end'].toLocaleString('en-gb', // 24h clock
    { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        tz = obj['current-end'].toLocaleString('en-gb', { timeZoneName: 'short' }).split(' ').pop();;
    $('.current-end').text(val);
    $('.current-end-tz').text(tz);
  }

  if (obj['auction_stage'] !== undefined) {
    switch (obj.auction_stage) {
      case 0:
        break;
      case 1:
        handleStageChange('not-started');
        break;
      case 2:
        handleStageChange('started');
        break;
      case 3:
      case 4:
        handleStageChange('ended');
        clearInterval(countdown);
    }

    // on first call, fadeOut loading overlay
    $('.se-pre-con').fadeOut(1000);
  }
}

function getStaticData() {
  $.when($.getJSON('assets/scripts/static.json'), $.getJSON('assets/scripts/status.json')).done(function (staticRes, statusRes) {
    var json = $.extend(staticRes[0], statusRes[0]['status'] || {});
    var tokensRetained = json.totalSupply - json.tokensOffered;
    $('.tokens-offered').text(json.tokensOffered);
    $('.tokens-retained').text(tokensRetained);
    $('.total-supply').text(json.totalSupply);
    $('.starting-price').text(json.price_start / 1e18);

    if (json.start_time) {
      var d = new Date(json.start_time * 1000),
          val = d.toLocaleString('en-gb', // 24h clock
      { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
          tz = d.toLocaleString('en-gb', { timeZoneName: 'short' }).split(' ').pop();
      $('.auction-start').text(val);
      $('.auction-start-tz').text(tz);
    }
  }).fail(function (jqxhr, textStatus, error) {
    var err = textStatus + ', ' + error;
    console.error('Request Failed: ', err);
  });
}

getStaticData();

function handleStageChange(newStage) {
  if (oldStage !== newStage) {
    oldStage = newStage;
    switch (newStage) {
      case 'not-started':
        $('#auction-title').text('The Raiden token auction starts on October 18th around 3pm UTC.');
        $('#auctionrunning').hide();
        $('#timer-container').hide();
        $('#graph-section').hide();
        $('#kyc-information').hide();
        $('#videointro-container').hide();
        $('#participate-button-container').hide();
        $('#spanner').hide();
        $('#linktoauctionexplainer').hide();
        $('#explainervideo').show();
        $('#auction-subtitle').show();
        $('#auction-subtitle').text('The auction format combines certainty of participation with certainty of valuation.');
        $('.not-started').show();
        break;
      case 'started':
        $('#graph-section').show();
        $('#auction-title').text('The Raiden Token Launch is live.');
        $('#auction-subtitle').show();
        $('#auction-subtitle').text('Participate at an implied valuation you consider fair.');
        $('#videointro-container').hide();
        $('#spanner').show();
        $('#linktoauctionexplainer').show();
        $('#explainervideo').hide();
        $('#kyc-firststage').hide();
        $('#auction-explainer-container').hide();
        $('#timer-container').show();
        $('#participate-button-container').show();
        $('#kyc-information').show();
        $('.not-started').hide();
        $('.started').show();
        $('.ended').hide();
        break;
      case 'ended':
        $('#auctionrunning').hide();
        $('#auction-explainer-container').hide();
        $('#auction-title').text('The Token Launch is Over');
        $('#auction-subtitle').show();
        $('#auction-subtitle').text('The RDN tokens have now been distributed.');
        $('#subtitle').text('The token launch is over.');
        $('#timer-container').hide();
        $('#participate-button-container').remove();
        $('#kyc-information').remove();
        $('#graph-section').show();
        $('#videointro-container').hide();
        $('#linktoauctionexplainer').hide();
        $('#explainervideo').hide();
        $('#kyc-firststage').hide();
        $('.started').hide();
        $('.ended').show();
        break;
      default:
        break;
    }
  }
}

function updateAuctionAddress(addr) {
  // var href = $('.address-link').attr('href');
  // href = href.replace(/[^/]*$/, addr);
  // $('.address-link').attr('href', href);
  // $('.address').attr('value', addr);
}

var countdown = setInterval(function () {
  ticker();
}, 1000);

function ticker() {
  var now = Date.now();
  var distance, beforeOrAfter;

  if (startDay >= now) {
    beforeOrAfter = 'before';
    distance = startDay - now;
  } else {
    beforeOrAfter = 'after';
    distance = endDay - now;
  }

  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
  var minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60));
  var seconds = Math.floor(distance % (1000 * 60) / 1000);

  if (days < 10) days = '0' + days;
  if (hours < 10) hours = '0' + hours;
  if (minutes < 10) minutes = '0' + minutes;
  if (seconds < 10) seconds = '0' + seconds;

  $('#timer').text(days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ');

  // Old place where auction stage was changed.
  // Correct auction stage is received in status.json

  /*if (beforeOrAfter === 'before') { // before auction
    handleStageChange('not-started');
  } else if (beforeOrAfter === 'after' && seconds >= 0 ) { // during auction
    handleStageChange('started');
  } else { // auction ended
    handleStageChange('ended');
    clearInterval(countdown);
    clearInterval(pollData);
  }*/
}

//button to show or hide the eth address
$(document).ready(function () {
  // tooltips
  $('[data-toggle="tooltip"]').tooltip({
    placement: function placement(ctx, src) {
      if ($(window).width() < 1200) {
        return 'bottom';
      } else {
        return 'left';
      }
    }
  });
  $('#auctionrunning').hide();
  $('#agreetac').click(function () {
    $('#auctionrunning').show();
    $('#timer-container').hide();
    $('#contribute-btn').hide();
  });

  // initial stage == 2
  handleStageChange('started');
  // to be safe, if status doens't load
  $('.se-pre-con').delay(2000).fadeOut(1000);
});

$('#disagreetac').click(function () {
  $.ajax({
    success: function success(result) {
      $('#auctionrunning').hide();
    }
  });
});

$('#print').click(function () {
  $('#terms1').print();
});

ticker();

$('#auctionaddress').click(function ($event) {
  $event.target.select();
});

$('#copyButton').click(function () {
  $('#auctionaddress').select();
  document.execCommand('copy');
});

$('#price').bind('input change keyup', function ($event) {
  var val = +$event.target.value;
  $('#offeredvalue').val(Math.floor(val * 50e6));
});

$('#offeredvalue').bind('input change keyup', function ($event) {
  var val = +$event.target.value;
  $('#price').val((val / 50e6).toFixed(7));
});

function checkAlertsForm() {
  var priceMax = getCurrentPriceAt(new Date()),
      priceMin = getCurrentPriceAt(maxTime),
      valueMax = Math.floor(priceMax * totalIssued);
  valueMin = Math.floor(priceMin * totalIssued);
  $('#alerts-form #price').attr('max', priceMax.toFixed(7));
  $('#alerts-form #price').attr('min', priceMin.toFixed(7));
  $('#alerts-form #offeredvalue').attr('max', valueMax);
  $('#alerts-form #offeredvalue').attr('min', valueMin);

  var price = +$('#alerts-form #price').val();
  var valid = $('#alerts-form #email').val().match(/@/) && price && grecaptcha.getResponse() && $('#noLiability').is(':checked') && priceMin <= price && price <= priceMax;
  $('#alerts-confirm').prop('disabled', !valid);
  return valid;
}
$('#alerts-form input').bind('change keyup input', checkAlertsForm);
$('#alerts-form').on('submit', function (e) {
  var valid = checkAlertsForm();
  if (!valid || $('#alerts-confirm').prop('disabled')) {
    e.preventDefault();
  }
});

$('#alerts-confirm').click(function (e) {
  checkAlertsForm();
  e.preventDefault();
  if (!$('#alerts-confirm').prop('disabled')) {
    $.post('https://pricealert.token.raiden.network/set_alert', {
      email: $('#email').val(),
      offeredvalue: $('#offeredvalue').val(),
      price: $('#price').val(),
      noLiability: true,
      'g-recaptcha-response': grecaptcha.getResponse()
    }).done(function () {
      $('#price-alert-error').hide();
      $('#price-alert-success').show();
    }).fail(function () {
      $('#price-alert-success').hide();
      $('#price-alert-error').show();
    }).always(function () {
      $('#price-alert-info').hide();
      $('#alerts-form').hide();
      $('#alerts-confirm').hide();
    });
  }
});

$('#alerts-modal').on('shown.bs.modal', checkAlertsForm);

$('#alerts-modal').on('hidden.bs.modal', function (e) {
  // remove vertical line
  clearClickedVline(); // defined in auction-graph.js
  // set default view
  $('#price-alert-info').show();
  $('#alerts-form').show();
  $('#alerts-confirm').show();
  $('#price-alert-error').hide();
  $('#price-alert-success').hide();
  checkAlertsForm();
});

function setAlertsValue() {
  if (!clicked || !clicked.x) {
    return;
  } else if (clicked.x < new Date() || clicked.x > maxTime) {
    clearClickedVline();
    return;
  }
  var value = Math.floor(clicked.y);
  $('#price').val(value / totalIssued);
  $('#offeredvalue').val(value);
  $('#alerts-btn').click();
}
//# sourceMappingURL=token.js.map
