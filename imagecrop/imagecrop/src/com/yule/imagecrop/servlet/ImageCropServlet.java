package com.yule.imagecrop.servlet;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

@WebServlet(urlPatterns = { "/imagecrop" })
public class ImageCropServlet extends HttpServlet {
	private static final long serialVersionUID = 6989218268965145807L;
	Logger log = Logger.getLogger(ImageCropServlet.class);

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		int x = Integer.parseInt(req.getParameter("x"));
		int y = Integer.parseInt(req.getParameter("y"));
		int scale = Integer.parseInt(req.getParameter("sc"));

		BufferedImage img = null;
		try {
			img = ImageIO.read(new File(
					"D:\\ws\\imagecrop\\imagecrop\\WebContent\\crop.jpg"));
			BufferedImage scaledImage = resizeImage(img, (double) scale / 100);
			BufferedImage resultImage = cropImage(scaledImage, x, y, 200, 200);
			ImageIO.write(resultImage, "jpg", new File(
					"D:\\ws\\imagecrop\\imagecrop\\WebContent\\result.jpg"));
		} catch (IOException e) {
			log.error(e.getMessage(), e);
		}

	}

	private BufferedImage cropImage(BufferedImage img, int x, int y, int width,
			int height) {
		return img.getSubimage(x, y, width, height);
	}

	private BufferedImage resizeImage(BufferedImage img, double scale) {
		int height = img.getHeight();
		int width = img.getWidth();
		int scaledHeight = (int) (height * scale);
		int scaledWidth = (int) (width * scale);
		BufferedImage scaledImage = new BufferedImage(scaledWidth,
				scaledHeight, img.getType());
		Graphics2D graphics = scaledImage.createGraphics();
		graphics.drawImage(img, 0, 0, scaledWidth, scaledHeight, null);
		graphics.dispose();
		return scaledImage;

	}

}
