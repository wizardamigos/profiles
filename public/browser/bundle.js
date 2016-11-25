var config = location.href.split('/').filter(function(x,i,arr) { return (i !== arr.length-1) }).join('/') + '/config.json'

ajax(config, function (data) {
  data = JSON.parse(data)
  var container = document.createElement('div')
  container.setAttribute('id','container')
  container.innerHTML = `
    <h1>welcome ${data.username} :-)</h1>
    <xmp>
      ${JSON.stringify(data, null, 2)}
    </xmp>
  `
  document.body.appendChild(container)
})

/******************************************************************************
  HELPER
******************************************************************************/
function ajax (params, callback) {
  var url = typeof params === 'string' ? params : params.url
  var method = params.method || (params.data ? 'POST': 'GET')
  var body = params.data
  var H = params.headers ? params.headers : params.body ? {
    'X-Requested-With' :'XMLHttpRequest',
    'Content-Type'     :'application/x-www-form-urlencoded'
  } : {}
  var xhr = new XMLHttpRequest()
  if (!xhr) throw new Error('No AJAX support')
  xhr.open(method, url)
  for (var key in H) xhr.setRequestHeader(key, H[key])
  xhr.onload = xhr.onerror = function (response) {
    var Hjson = {}, h = xhr.getAllResponseHeaders()
    ;(h.match(/([^\n\r:]+):([^\n\r]+)/g)||[]).forEach(function(item){
      var tmp = item.split(': ')
      Hjson[tmp[0]] = tmp[1]
    })
    if (callback) callback(this.response, response, xhr, Hjson)
  }
  xhr.send(body||null)
}
