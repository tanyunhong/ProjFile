export function getUploader (component) {
  let parent = component.$parent
  while (parent) {
    if (parent.uploader) {
      return parent.uploader
    } else {
      parent = parent.$parent
    }
  }
  return null
}

export function secondsToStr (temp) {
  const years = Math.floor(temp / 31536000)
  if (years) {
    return years + ' year' + numberEnding(years)
  }
  const days = Math.floor((temp %= 31536000) / 86400)
  if (days) {
    return days + ' day' + numberEnding(days)
  }
  const hours = Math.floor((temp %= 86400) / 3600)
  if (hours) {
    return hours + ' hour' + numberEnding(hours)
  }
  const minutes = Math.floor((temp %= 3600) / 60)
  if (minutes) {
    return minutes + ' minute' + numberEnding(minutes)
  }
  const seconds = temp % 60
  return seconds + ' second' + numberEnding(seconds)
  function numberEnding (number) {
    return (number > 1) ? 's' : ''
  }
}

function domNodeClick (e) {
  if (e.target.tagName === 'INPUT') {
    return
  }
  e.target.lastChild.click()
}

export function assignBrowse(domNodes, isDirectory, singleFile, attributes, uploader) {
  if (typeof domNodes.length === 'undefined') {
    domNodes = [domNodes]
  }

  domNodes.forEach(domNode => {
    var input
    if (domNode.tagName === 'INPUT' && domNode.type === 'file') {
      input = domNode
    } else {
      console.log('lastchild', domNode.childNodes)
      let childNodes = domNode.childNodes
      for (const childNode of childNodes) {
        if (childNode.tagName === 'INPUT') {
          domNode.removeEventListener('click', domNodeClick, false)
          domNode.removeChild(childNode)
        }
      }
      input = document.createElement('input')
      input.setAttribute('type', 'file')
      // display:none - not working in opera 12
      input.style.visibility = 'hidden'
      input.style.position = 'absolute'
      input.style.width = '1px'
      input.style.height = '1px'
      // for opera 12 browser, input must be assigned to a document
      domNode.appendChild(input)
      // https://developer.mozilla.org/en/using_files_from_web_applications)
      // event listener is executed two times
      // first one - original mouse click event
      // second - input.click(), input is inside domNode
      domNode.addEventListener('click', domNodeClick, false)
    }
    if (!singleFile) {
      input.setAttribute('multiple', 'multiple')
    }
    if (isDirectory) {
      input.setAttribute('webkitdirectory', 'webkitdirectory')
    }
    if (attributes) {
      for (const key in attributes) {
        if (attributes.hasOwnProperty(key)) {
          const value = attributes[key];
          input.setAttribute(key, value)
        }
      }
    }
    // When new files are added, simply append them to the overall list
    input.addEventListener('change', function (e) {
      if (e.target.value) {
        uploader.addFiles(e.target.files, e)
        e.target.value = ''
      }
    }, false)
  }, this);
}
