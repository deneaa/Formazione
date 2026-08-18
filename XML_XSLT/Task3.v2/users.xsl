<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8"/>

  <xsl:template match="/user">
    <table class="table">
      <thead>
        <tr>
          <th data-column="id">ID <span class="icon-arrow">↑</span></th>
          <th data-column="firstName">First Name <span class="icon-arrow">↑</span></th>
          <th data-column="lastName">Last Name <span class="icon-arrow">↑</span></th>
          <th data-column="email">Email <span class="icon-arrow">↑</span></th>
          <th data-column="phone">Phone <span class="icon-arrow">↑</span></th>
        </tr>
      </thead>
      <tbody>
        <xsl:for-each select="results">
          <tr data-id="{position()}"
              data-firstname="{name/first}"
              data-lastname="{name/last}"
              data-email="{email}"
              data-phone="{phone}"
              data-title="{name/title}"
              data-street="{location/street/name}"
              data-city="{location/city}"
              data-state="{location/state}"
              data-zip="{location/postcode}">
            <td><xsl:value-of select="position()"/></td>
            <td><xsl:value-of select="name/first"/></td>
            <td><xsl:value-of select="name/last"/></td>
            <td><xsl:value-of select="email"/></td>
            <td><xsl:value-of select="phone"/></td>
          </tr>
        </xsl:for-each>
      </tbody>
    </table>
  </xsl:template>
</xsl:stylesheet>
