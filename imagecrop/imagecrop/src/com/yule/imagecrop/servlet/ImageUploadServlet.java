package com.yule.imagecrop.servlet;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

@WebServlet(urlPatterns = { "/imageupload" })
@MultipartConfig
public class ImageUploadServlet extends HttpServlet {
	private static final long serialVersionUID = -808308267998070082L;

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		Part p1 = req.getPart("file");
		InputStream is = p1.getInputStream();

		BufferedImage img = ImageIO.read(is);
		ImageIO.write(img, "jpg", new File(
				"D:\\ws\\imagecrop\\imagecrop\\WebContent\\crop.jpg"));

		resp.setContentType("application/json");
		PrintWriter writer = resp.getWriter();
		writer.print("{\"result\":\"success\"}");
		writer.close();
	}

	private static String getFilename(Part part) {
		for (String cd : part.getHeader("content-disposition").split(";")) {
			if (cd.trim().startsWith("filename")) {
				String filename = cd.substring(cd.indexOf('=') + 1).trim()
						.replace("\"", "");
				return filename.substring(filename.lastIndexOf('/') + 1)
						.substring(filename.lastIndexOf('\\') + 1); // MSIE fix.

			}
		}
		return null;
	}
}
