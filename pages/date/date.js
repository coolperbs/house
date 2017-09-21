var _fn,
    currentSelect = [],
    app = getApp(),
    weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];


Page( {
  data: {
    // hasEmptyGrid 变量控制是否渲染空格子，若当月第一天是星期天，就不应该渲染空格子
    hasEmptyGrid: false 
  },
  onShareAppMessage : app.shareFunc,

  // 初始化数据
  onShow() {
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    currentSelect = wx.getStorageSync( 'datetime' ) || [];
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month);
    this.getSystemInfo();
    this.setData({
      cur_year : cur_year,
      cur_month : cur_month,
      weeks : weeks_ch
    })

    _fn.renderSelectDay( this );
  },

  // onShow : function() {
  //   // 清空选择，避免只选一天的情况
  //   //currentSelect = wx.getStorageSync( 'datetime' ) || [];
  // },

  // 选择天
  selectDay : function( e ) {
    var data = e.currentTarget.dataset,
        start, end,
        selectDate = _fn.createDayTime( data.year, data.month, data.day );

    currentSelect.push( {
      time : selectDate.getTime(),
      day : data.day,
      month : data.month,
      year : data.year,
      week : weeks_ch[selectDate.getDay()]
    } );

    if ( currentSelect.length > 2 ) {
      currentSelect = currentSelect.slice( currentSelect.length - 1 );
    }

    currentSelect = _fn.sortDate( currentSelect );
    this.calculateDays( data.year, data.month );
    if ( currentSelect.length == 2 ) {
      wx.setStorageSync( 'datetime', currentSelect );
      wx.navigateBack();
    }
  },

  onShareAppMessage() {},





  // 控制scroll-view高度
  getSystemInfo() {
    try {
      const res = wx.getSystemInfoSync();
      this.setData({
        scrollViewHeight: res.windowHeight * res.pixelRatio || 667
      });
    } catch (e) {
      console.log(e);
    }
  },
  // 获取当月共多少天
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  // 获取当月第一天星期几
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  // 计算当月1号前空了几个格子
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  // 绘制当月天数占的格子
  calculateDays(year, month ) {
    let days = [],
        selected, currentDay;
    const thisMonthDays = this.getThisMonthDays(year, month);

    // 计算状态
    for (let i = 1; i <= thisMonthDays; i++) {
      selected = false;

      if ( currentSelect.length == 1 
        && currentSelect[0].year == year
        && currentSelect[0].month == month
        && currentSelect[0].day == i ) {
        selected = true;
      } else if ( currentSelect.length == 2  ) {
        currentDay = _fn.createDay( year, month, i );
        var startDay = _fn.createDay( currentSelect[0].year, currentSelect[0].month, currentSelect[0].day );
        var endDay = _fn.createDay( currentSelect[1].year, currentSelect[1].month, currentSelect[1].day );
        if ( currentDay >= startDay && currentDay <= endDay ) {
          selected = true;
        }
      }

      days.push( {
        day : i,
        selected : selected
      } );
    }

    this.setData({
      days : days
    });
  },

  // 切换控制年月
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })

    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
    }
  }
} );

_fn = {
  createDayTime : function( year, month, day ) {
    var result = new Date();

    result.setFullYear( year );
    result.setMonth( month - 1 );
    result.setDate( day );
    result.setHours( 12 );
    result.setMinutes( 0 );
    result.setSeconds( 0 );
    return result;
  },
  createDay : function( year, month, day ) {
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    return ( '' + year + month + day ) * 1;
  },
  sortDate : function( array ) {
    if ( array.length != 2 ) {
      return array;
    }
    var start, end;

    if ( currentSelect[1].time > currentSelect[0].time ) {
      start = currentSelect[0];
      end = currentSelect[1];
    } else if ( currentSelect[1].time <= currentSelect[0].time ) {
      start = currentSelect[1];
      end = currentSelect[0];
    }    
    return [start, end];
  },
  renderSelectDay : function( caller ) {
    var selectDays = wx.getStorageSync( 'datetime' ) || {}; // start end allday
    caller.setData( {
      selectDays : selectDays
    } );
  }
}

