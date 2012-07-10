package com.yule.imagecrop.servlet;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import org.apache.log4j.Logger;

@WebServlet(urlPatterns = { "/image/*" })
public class ImageServlet extends HttpServlet {
	private static final long serialVersionUID = 5344700236751396802L;
	Logger log = Logger.getLogger(ImageServlet.class);

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		resp.setContentType("image/jpeg");
		String uri = req.getRequestURI();
		String filename = null;
		if (uri.contains("&")) {
			filename = uri
					.substring(uri.lastIndexOf("/") + 1, uri.indexOf("&"));
		} else {
			filename = uri.substring(uri.lastIndexOf("/") + 1);
		}

		try {
			BufferedImage img = ImageIO.read(new File(
					"/home/yle/html5/crop/Html5/imagecrop/imagecrop/WebContent/" + filename));
			ImageIO.write(img, "jpg", resp.getOutputStream());
		} catch (IOException e) {
			log.error(e.getMessage(), e);
		}

	}

	

}
